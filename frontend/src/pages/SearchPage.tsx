import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { videoService } from '../services/video.service';
import { Video, Category } from '../types';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [videosData, categoriesData] = await Promise.all([
        videoService.getAll(),
        categoryService.getAll(true),
      ]);
      setVideos(videosData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(video.categoryId)) {
      return false;
    }
    if (searchQuery) {
      return video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.externalId.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F8F8FA]">
      {/* Header & Search */}
      <header className="pt-8 pb-4 px-8 md:px-12 flex flex-col gap-6 shrink-0 z-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">Explorar Contenido</h2>
            <p className="text-slate-500 mt-1">Encuentra guías, protocolos y cursos de entrenamiento.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span>Usa <kbd className="font-mono bg-slate-200 px-1 rounded text-slate-700">Cmd+K</kbd> para búsqueda rápida</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-4xl shadow-lg shadow-primary/5 rounded-xl group focus-within:shadow-primary/10 transition-shadow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            className="block w-full pl-12 pr-28 py-4 bg-white border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-accent/20 focus:outline-none text-lg font-medium shadow-sm"
            placeholder="Buscar por título, código o palabra clave..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button className="bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Active Filters / Meta */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Resultados: {filteredVideos.length}</span>
            <span className="h-4 w-px bg-slate-300 mx-2"></span>
            <div className="flex gap-2">
              {selectedCategories.map(catId => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <span key={catId} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/10">
                    {category.name}
                    <button onClick={() => toggleCategory(catId)} className="hover:text-red-500 ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 mr-2">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-0 bg-transparent text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer pr-8 py-0"
            >
              <option value="relevance">Relevancia</option>
              <option value="recent">Más recientes</option>
              <option value="viewed">Más vistos</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content Split View */}
      <div className="flex-1 overflow-hidden flex">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12">
          <div className="flex gap-10 min-h-full">
            {/* Inner Sidebar Filters */}
            <div className="w-64 shrink-0 hidden lg:block pt-2">
              <div className="sticky top-0 flex flex-col gap-8 pb-10">
                {/* Filter Group: Category */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categoría</h3>
                  <div className="flex flex-col gap-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="rounded w-4 h-4 text-primary focus:ring-accent/20 border-slate-300 transition-colors"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{category.name}</span>
                        <span className="ml-auto text-xs text-slate-400">{category.videoCount || 0}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Group: Type */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tipo de Contenido</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded w-4 h-4 text-primary focus:ring-accent/20 border-slate-300" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                      </svg>
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">Video</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded w-4 h-4 text-primary focus:ring-accent/20 border-slate-300" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">Documento</span>
                    </label>
                  </div>
                </div>

                <button className="text-xs font-medium text-accent hover:text-red-700 flex items-center gap-1 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Resetear filtros
                </button>
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 flex flex-col gap-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className="text-gray-600 font-medium">No se encontraron resultados</p>
                </div>
              ) : (
                <>
                  {filteredVideos.map((video, index) => (
                    <Link
                      key={video.id}
                      to={`/topic/${video.topics?.[0]?.id || video.id}`}
                      className="group bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden"
                    >
                      {/* Selection Highlight */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Thumbnail */}
                      <div className="relative w-full sm:w-56 shrink-0 aspect-video rounded-lg overflow-hidden bg-slate-100">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {video.duration || '14:20'}
                        </div>
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {video.externalId}
                          </span>
                          {index === 0 && (
                            <span className="text-[10px] font-bold tracking-wide uppercase text-accent">Obligatorio</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-tight mb-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                          {video.description || 'Contenido de capacitación disponible.'}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                              {video.category?.name || 'General'}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                              {video.topicCount || video.topics?.length || 0} Temas
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {Math.floor(Math.random() * 2000) + 500}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {Math.floor(Math.random() * 30) + 1}d
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Load More */}
                  <div className="flex justify-center mt-4">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors text-sm font-semibold shadow-sm w-full">
                      Cargar más resultados
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
      setSearchParams(params);
    }
  };

  const performSearch = async (searchQuery: string, categoryId: string) => {
    setLoading(true);
    try {
      const data = await searchService.search(searchQuery, categoryId || undefined, pagination.page);
      setResults(data.results);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryFilter = (categoryId: string) => {
    if (selectedFilters.includes(categoryId)) {
      setSelectedFilters(selectedFilters.filter(id => id !== categoryId));
    } else {
      setSelectedFilters([...selectedFilters, categoryId]);
    }
  };

  const removeFilter = (categoryId: string) => {
    setSelectedFilters(selectedFilters.filter(id => id !== categoryId));
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setSelectedCategory('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light">
      {/* Header & Search */}
      <header className="pt-8 pb-4 px-8 md:px-12 flex flex-col gap-6 shrink-0 z-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">Explorar Contenido</h2>
            <p className="text-slate-500 mt-1">Encuentra guías, protocolos y cursos de entrenamiento.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span>Usa <kbd className="font-mono bg-slate-200 px-1 rounded text-slate-700">Cmd+K</kbd> para búsqueda rápida</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative w-full max-w-4xl shadow-lg shadow-primary/5 rounded-xl group focus-within:shadow-primary/10 transition-shadow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-focus-within:text-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            className="block w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-accent/20 focus:outline-none text-lg font-medium shadow-sm" 
            placeholder="Buscar por título, código (e.g. VEN-001) o palabra clave..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button 
              type="submit"
              className="bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Active Filters / Meta */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Resultados: {pagination.total}</span>
            <span className="h-4 w-px bg-slate-300 mx-2"></span>
            <div className="flex gap-2">
              {selectedFilters.map(filterId => {
                const category = categories.find(c => c.id === filterId);
                return category ? (
                  <span key={filterId} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/10">
                    {category.name}
                    <button onClick={() => removeFilter(filterId)} className="hover:text-red-500 ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 mr-2">Ordenar por:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-0 bg-transparent text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer pr-8 py-0"
            >
              <option value="relevance">Relevancia</option>
              <option value="recent">Más recientes</option>
              <option value="viewed">Vistos recientemente</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content Split View */}
      <div className="flex-1 overflow-hidden flex">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12">
          <div className="flex gap-10 min-h-full">
            {/* Inner Sidebar Filters */}
            <div className="w-64 shrink-0 hidden lg:block pt-2">
              <div className="sticky top-0 flex flex-col gap-8 pb-10">
                {/* Filter Group: Category */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categoría</h3>
                  <div className="flex flex-col gap-2">
                    {categories.slice(0, 6).map(category => (
                      <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          checked={selectedFilters.includes(category.id)}
                          onChange={() => toggleCategoryFilter(category.id)}
                          className="rounded size-4 text-primary focus:ring-accent/20 border-slate-300 transition-colors" 
                          type="checkbox"
                          style={{
                            backgroundColor: selectedFilters.includes(category.id) ? '#312c68' : undefined,
                            borderColor: selectedFilters.includes(category.id) ? '#312c68' : undefined
                          }}
                        />
                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{category.name}</span>
                        <span className="ml-auto text-xs text-slate-400">{category.videoCount || 0}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Group: Type */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tipo de Contenido</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded size-4 text-primary focus:ring-accent/20 border-slate-300 transition-colors" type="checkbox" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                      </svg>
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">Video</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded size-4 text-primary focus:ring-accent/20 border-slate-300 transition-colors" type="checkbox" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">Documento PDF</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded size-4 text-primary focus:ring-accent/20 border-slate-300 transition-colors" type="checkbox" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">Evaluación</span>
                    </label>
                  </div>
                </div>

                {/* Filter Group: Tags */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary hover:text-primary transition-colors">Cajas</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary hover:text-primary transition-colors">Atención</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary hover:text-primary transition-colors">SAP</button>
                    <button className="px-3 py-1 bg-primary border border-primary rounded-full text-xs text-white shadow-sm">Urgente</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary hover:text-primary transition-colors">Inventario</button>
                  </div>
                </div>

                <button 
                  onClick={resetFilters}
                  className="text-xs font-medium text-accent hover:text-red-700 flex items-center gap-1 mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Resetear filtros
                </button>
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 flex flex-col gap-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : results.length === 0 && query ? (
                <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-600">Intenta con otros términos de búsqueda o una categoría diferente</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  {results.map((topic) => (
                    <Link
                      key={topic.id}
                      to={`/topic/${topic.id}`}
                      className="group bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden"
                    >
                      {/* Selection Highlight */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Thumbnail */}
                      <div className="relative w-full sm:w-56 shrink-0 aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                          style={{ backgroundImage: topic.video?.thumbnailUrl ? `url(${topic.video.thumbnailUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        ></div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {formatTimestamp(topic.timestamp)}
                        </div>
                        <div className="absolute top-2 left-2 size-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {topic.code}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-tight mb-2">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                          {topic.description || 'Contenido de capacitación disponible.'}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {topic.video?.category && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {topic.video.category.name}
                              </span>
                            )}
                            {topic.tags && topic.tags.slice(0, 2).map((topicTag) => (
                              <span key={topicTag.tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                {topicTag.tag.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {Math.floor(Math.random() * 3000 + 500)}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {new Date(topic.createdAt || Date.now()).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Load More */}
                  {pagination.totalPages > pagination.page && (
                    <div className="flex justify-center mt-4">
                      <button 
                        onClick={() => {
                          const params: any = { q: query, page: (pagination.page + 1).toString() };
                          if (selectedCategory) {
                            params.category = selectedCategory;
                          }
                          setSearchParams(params);
                        }}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors text-sm font-semibold shadow-sm w-full"
                      >
                        Cargar más resultados
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Realiza una búsqueda</h3>
                  <p className="text-gray-600">Ingresa un término de búsqueda para encontrar temas relacionados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
