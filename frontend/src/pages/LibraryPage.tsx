import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { Category } from '../types';

export default function LibraryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    if (searchQuery) {
      return category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      manager: 'from-purple-500 to-purple-600',
      ventas: 'from-green-500 to-green-600',
      compliance: 'from-red-500 to-red-600',
      rh: 'from-blue-500 to-blue-600',
      management: 'from-purple-500 to-purple-600',
      tools: 'from-amber-500 to-amber-600',
    };
    const key = categoryName.toLowerCase();
    return colors[key] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f9f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f9f9fb]">
      {/* Header */}
      <header className="flex-none px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight">
                Biblioteca de Cursos
              </h1>
              <p className="text-slate-500 mt-1">
                Explora los cursos disponibles.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Buscar cursos por nombre..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-500 text-lg font-medium">No se encontraron cursos</p>
              <p className="text-slate-400 text-sm mt-1">Intenta ajustar tu búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/course/${category.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all hover:-translate-y-1">
                    {/* Card Header with Gradient */}
                    <div className={`h-32 bg-gradient-to-br ${getCategoryColor(category.name)} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.94-.98-7-5.06-7-9.5V8.52l7-3.11v15.09z"/>
                        </svg>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-white/20 backdrop-blur-sm">
                          {category.videos?.length || 0} videos
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                          {category.description}
                        </p>
                      )}
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-slate-500 text-sm pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>{category.videos?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>
                            {category.videos?.reduce((acc, video) => acc + (video.topics?.length || 0), 0) || 0} temas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="px-6 pb-4 flex items-center text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Ver curso</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
