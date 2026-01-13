import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { videoService } from '../services/video.service';
import { Category, Video } from '../types';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, videosData] = await Promise.all([
        categoryService.getAll(true),
        videoService.getAll(),
      ]);
      setCategories(categoriesData);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total duration from actual videos
  const totalMinutes = videos.reduce((sum, video) => {
    if (typeof video.duration === 'number') {
      return sum + video.duration;
    }
    // Fallback: estimate 15 minutes per video if no duration
    return sum + 15;
  }, 0);

  const totalVideos = videos.length;
  const totalHours = Math.floor(totalMinutes / 60);

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
          <Link to="/library" className="text-sm font-semibold text-primary hover:underline">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[180px]">
            {/* Large Feature Card - First category */}
            {categories[0] && (
              <Link
                to={`/course/${categories[0].id}`}
                className="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 shadow-md hover:-translate-y-1 transition-all cursor-pointer bg-primary"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#241f55] to-black opacity-90 z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800')"}}></div>
                <div className="relative z-20 h-full flex flex-col justify-between p-8">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Destacado</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{categories[0].name}</h3>
                    <p className="text-gray-200 text-sm md:text-base max-w-md line-clamp-2">{categories[0].description}</p>
                    <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                      </svg>
                      {categories[0].videoCount || 0} Videos
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Standard Cards */}
            {categories.slice(1, 5).map((category, index) => {
              const colors = [
                { bg: 'from-blue-50 to-white', icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-100 text-blue-800' },
                { bg: 'from-green-50 to-white', icon: 'bg-green-100 text-green-600', badge: 'bg-green-100 text-green-800' },
                { bg: 'from-purple-50 to-white', icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-100 text-purple-800' },
                { bg: 'from-red-50 to-white', icon: 'bg-red-100 text-red-600', badge: 'bg-red-100 text-red-800' }
              ];
              const color = colors[index] || colors[0];

              return (
                <Link
                  key={category.id}
                  to={`/course/${category.id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer bg-white border border-gray-100"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-50`}></div>
                  <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                    <div className={`h-10 w-10 rounded-lg ${color.icon} flex items-center justify-center mb-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{category.description}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.badge}`}>
                        {category.videoCount || 0} Videos
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="h-12"></div>
      </div>
    </div>
  );
};

export default HomePage;
