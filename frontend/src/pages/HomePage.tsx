import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { Category } from '../types';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(true);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalVideos = categories.reduce((sum, cat) => sum + (cat.videoCount || 0), 0);
  const totalHours = Math.floor(totalVideos * 20 / 60); // Estimación: 20min promedio por video

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8F8FA]">
      {/* Header & Top Stats Area */}
      <div className="flex-shrink-0 px-8 pt-8 pb-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#121118] tracking-tight">
              Bienvenido de vuelta, {user?.username}
            </h1>
            <p className="text-[#636085] mt-1">Aquí está el resumen de tu aprendizaje hoy.</p>
          </div>
          <div className="flex gap-3">
            {/* Secondary Actions */}
            <Link 
              to="/library"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-primary text-sm font-bold shadow-sm hover:shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Ver Biblioteca
            </Link>
            {/* Primary Action */}
            <Link 
              to="/search"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-900/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Buscar Contenido
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          {/* Stat 1 */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Categorías</p>
              <p className="text-3xl font-black text-primary tracking-tight">{categories.length}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
              </svg>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Videos Disponibles</p>
              <p className="text-3xl font-black text-primary tracking-tight">{totalVideos}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
              </svg>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Horas de Contenido</p>
              <p className="text-3xl font-black text-primary tracking-tight">{totalHours}h</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-12">
        <div className="flex items-center justify-between mb-6 mt-4">
          <h2 className="text-xl font-bold text-gray-900">Explorar Categorías</h2>
          <Link to="/library" className="text-sm font-semibold text-primary hover:underline">Ver todas</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
            <p className="text-gray-600 font-medium">Sin categorías disponibles</p>
          </div>
        ) : (
          <>
            {/* Bento / Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[180px]">
              {/* Large Feature Card - First item */}
              {categories[0] && (
                <Link
                  to={`/course/${categories[0].id}`}
                  className="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 shadow-md hover:-translate-y-1 transition-all cursor-pointer bg-primary"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#241f55] to-black opacity-90 z-10"></div>
                  {/* Dot Pattern Background */}
                  <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                  }}></div>
                  
                  <div className="relative z-20 h-full flex flex-col justify-between p-8">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Nuevo</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{categories[0].name}</h3>
                      <p className="text-gray-200 text-sm md:text-base max-w-md line-clamp-2">{categories[0].description || 'Contenido de capacitación esencial.'}</p>
                      <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                        </svg>
                        {categories[0].videoCount || 0} Videos
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Standard Cards - Rest of categories */}
              {categories.slice(1).map((category, index) => {
                const colors = [
                  { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
                  { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
                  { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
                  { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' },
                  { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
                ];
                const colorSet = colors[index % colors.length];

                return (
                  <Link
                    key={category.id}
                    to={`/course/${category.id}`}
                    className="group relative overflow-hidden rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer bg-white border border-gray-100"
                  >
                    <div className={`absolute inset-0 ${colorSet.bg} opacity-50`}></div>
                    <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                      <div className={`h-10 w-10 rounded-lg ${colorSet.icon} ${colorSet.text} flex items-center justify-center mb-4`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{category.description || 'Contenido disponible'}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorSet.bg} ${colorSet.text}`}>
                          {category.videoCount || 0} Videos
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom spacing */}
            <div className="h-12"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
