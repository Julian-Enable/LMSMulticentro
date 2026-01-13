import { useState, useEffect } from 'react';
import { videoService } from '../services/videoService';
import { Video, Category } from '../types';
import { categoryService } from '../services/categoryService';

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [videosData, categoriesData] = await Promise.all([
        videoService.getAll(),
        categoryService.getAll(),
      ]);
      setVideos(videosData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort videos
  const filteredVideos = videos
    .filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.externalId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || video.categoryId === parseInt(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      ventas: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      compliance: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      rh: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      management: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      tools: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    };
    const key = categoryName.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const formatDuration = (topics: any[] = []) => {
    const totalMinutes = topics.reduce((acc, topic) => acc + (topic.duration || 0), 0);
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f9f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f9f9fb] relative">
      {/* Header Section */}
      <header className="flex-none px-8 py-6 pb-2">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* Title Row */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#121118] text-3xl font-black tracking-tight">
                Biblioteca de Contenidos
              </h1>
              <p className="text-[#636085] text-base">
                Gestione el material de capacitación y recursos de aprendizaje.
              </p>
            </div>
            <button className="bg-accent hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/10 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Nuevo Contenido
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            {/* Search */}
            <div className="flex-1 min-w-[280px]">
              <label className="flex items-center w-full bg-gray-50 rounded-lg px-3 py-2.5 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
                <svg className="w-5 h-5 text-[#636085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="bg-transparent border-none text-sm w-full ml-2 focus:ring-0 text-[#121118] placeholder-[#636085] p-0"
                  placeholder="Buscar por título, código o palabra clave..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </label>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="relative">
                <select
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-[#636085] transition-colors border border-transparent hover:border-gray-200 appearance-none pr-8 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Ordenar: Recientes</option>
                  <option value="alphabetical">Ordenar: Alfabético</option>
                </select>
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#636085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="relative">
                <select
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-[#636085] transition-colors border border-transparent hover:border-gray-200 appearance-none pr-8 cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Categoría: Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#636085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-[#636085] transition-colors border border-transparent hover:border-gray-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Estado</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid/Table Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2 custom-scrollbar">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-[#636085] uppercase tracking-wider items-center">
            <div className="col-span-5 md:col-span-4 lg:col-span-4 pl-12">Contenido</div>
            <div className="col-span-2 hidden md:block">Código</div>
            <div className="col-span-2 hidden lg:block">Categoría</div>
            <div className="col-span-3 md:col-span-4 lg:col-span-2">Detalles</div>
            <div className="col-span-2 md:col-span-2 lg:col-span-2 text-right">Acciones</div>
          </div>

          {/* Content Rows */}
          {paginatedVideos.map((video) => (
            <div
              key={video.id}
              className="group relative bg-white rounded-xl p-3 shadow-sm hover:shadow-md border border-gray-100 transition-all hover:-translate-y-0.5"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Content Column */}
                <div className="col-span-5 md:col-span-4 lg:col-span-4 flex items-center gap-4">
                  {/* Drag handle */}
                  <div className="absolute left-3 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                    </svg>
                  </div>

                  <div
                    className="h-16 w-24 rounded-lg bg-gray-200 flex-shrink-0 bg-cover bg-center overflow-hidden relative ml-6"
                    style={{ backgroundImage: video.thumbnailUrl ? `url(${video.thumbnailUrl})` : 'none' }}
                  >
                    {!video.thumbnailUrl && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>

                  <div className="flex flex-col min-w-0 pr-4">
                    <h3 className="text-[#121118] font-bold text-sm truncate leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-[#636085] text-xs mt-1 line-clamp-1">
                      {video.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>

                {/* Code Column */}
                <div className="col-span-2 hidden md:flex items-center">
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {video.externalId || 'N/A'}
                  </span>
                </div>

                {/* Category Column */}
                <div className="col-span-2 hidden lg:flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(video.category?.name || '')}`}>
                    {video.category?.name || 'Sin categoría'}
                  </span>
                </div>

                {/* Details Column */}
                <div className="col-span-3 md:col-span-4 lg:col-span-2 flex items-center gap-4 text-[#636085] text-xs">
                  <div className="flex items-center gap-1.5" title="Topics">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{video.topics?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Duration">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDuration(video.topics)}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Students">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>-</span>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="col-span-2 md:col-span-2 lg:col-span-2 flex items-center justify-end gap-2">
                  <button className="p-2 rounded-lg text-[#636085] hover:bg-primary/10 hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg text-[#636085] hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {paginatedVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[#636085] text-lg font-medium">No se encontraron contenidos</p>
              <p className="text-[#636085] text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}

          {/* Pagination */}
          {paginatedVideos.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pb-6 px-2">
              <p className="text-sm text-[#636085]">
                Mostrando <span className="font-bold text-[#121118]">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVideos.length)}</span> de <span className="font-bold text-[#121118]">{filteredVideos.length}</span> resultados
              </p>
              <div className="flex items-center gap-1">
                <button
                  className="p-2 rounded-lg text-[#636085] hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white font-bold'
                          : 'text-[#636085] hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="w-9 h-9 flex items-center justify-center text-[#636085]">...</span>
                    <button
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-[#636085] hover:bg-gray-100 text-sm font-medium"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className="p-2 rounded-lg text-[#636085] hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="bg-accent text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
