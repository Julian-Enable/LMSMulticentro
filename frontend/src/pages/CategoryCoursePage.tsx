import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { Category, Video } from '../types';
import { useAuthStore } from '../store/authStore';

export default function CategoryCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const data = await categoryService.getById(id!);
      setCategory(data);
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock progress data - in real app, fetch from backend
  const getVideoStatus = (index: number) => {
    if (index === 0) return 'completed';
    if (index === 1) return 'in-progress';
    return 'locked';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Completado
          </span>
        );
      case 'in-progress':
        return (
          <span className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            En Curso
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Pendiente
          </span>
        );
    }
  };

  const calculateTotalDuration = () => {
    const totalMinutes = videos.reduce((acc, video) => {
      return acc + (video.topics?.reduce((sum, topic) => sum + (topic.duration || 0), 0) || 0);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const completedCount = videos.filter((_, index) => getVideoStatus(index) === 'completed').length;
  const progressPercentage = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f8fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f8fa]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Categoría no encontrada</p>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-white dark:bg-background-dark border-r border-[#ebeaf0] dark:border-gray-800 shrink-0">
        <div className="flex flex-col h-full p-6 justify-between">
          <div className="flex flex-col gap-8">
            {/* Logo Area */}
            <div className="flex flex-col gap-1 px-2">
              <h1 className="text-primary dark:text-white text-xl font-bold leading-normal tracking-tight">
                Multicentro LMS
              </h1>
              <p className="text-[#636085] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                Formación Corporativa
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#ebeaf0] dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6 text-[#636085] dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-[#636085] dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white text-sm font-medium">
                  Dashboard
                </p>
              </Link>

              <Link
                to="/library"
                className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 dark:bg-primary/30"
              >
                <svg className="w-6 h-6 text-primary dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-primary dark:text-white text-sm font-bold">Cursos</p>
              </Link>

              <Link
                to="/progress"
                className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#ebeaf0] dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6 text-[#636085] dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-[#636085] dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white text-sm font-medium">
                  Mi Progreso
                </p>
              </Link>

              <Link
                to="/profile"
                className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#ebeaf0] dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6 text-[#636085] dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-[#636085] dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white text-sm font-medium">
                  Perfil
                </p>
              </Link>
            </nav>
          </div>

          {/* User Footer */}
          <div className="border-t border-[#ebeaf0] dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border border-gray-200 dark:border-gray-700">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-[#121118] dark:text-white">
                  {user?.username || 'Usuario'}
                </p>
                <p className="text-xs text-[#636085] dark:text-gray-400">
                  {user?.email || 'estudiante@ejemplo.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#f8f8fa]">
        {/* Breadcrumbs */}
        <div className="w-full px-6 py-6 md:px-10 lg:px-12 sticky top-0 bg-[#f8f8fa]/95 backdrop-blur-sm z-10 border-b border-transparent dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link to="/" className="text-[#636085] dark:text-gray-400 font-medium hover:text-primary dark:hover:text-white transition-colors">
              Inicio
            </Link>
            <span className="text-[#636085] dark:text-gray-500">/</span>
            <Link to="/library" className="text-[#636085] dark:text-gray-400 font-medium hover:text-primary dark:hover:text-white transition-colors">
              Categorías
            </Link>
            <span className="text-[#636085] dark:text-gray-500">/</span>
            <span className="text-primary dark:text-white font-bold bg-primary/5 dark:bg-primary/20 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
              {category.name}
            </span>
          </div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Content */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Header & Stats */}
              <div className="flex flex-col gap-6">
                {/* Page Heading */}
                <div className="flex flex-col gap-3">
                  <h1 className="text-[#121118] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                    {category.name}: <span className="text-primary dark:text-indigo-400">Nivel Avanzado</span>
                  </h1>
                  <p className="text-[#636085] dark:text-gray-300 text-lg font-medium leading-relaxed max-w-2xl">
                    {category.description || 'Domina las técnicas y estrategias avanzadas en este curso completo.'}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-background-dark p-4 border border-[#d7d6e1] dark:border-gray-700 shadow-sm min-w-[160px]">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#636085] dark:text-gray-400 text-xs font-bold uppercase tracking-wide">
                        Lecciones
                      </p>
                      <p className="text-[#121118] dark:text-white text-lg font-bold">
                        {videos.length} Videos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-background-dark p-4 border border-[#d7d6e1] dark:border-gray-700 shadow-sm min-w-[160px]">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#636085] dark:text-gray-400 text-xs font-bold uppercase tracking-wide">
                        Duración
                      </p>
                      <p className="text-[#121118] dark:text-white text-lg font-bold">
                        {calculateTotalDuration()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video List Section */}
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-xl font-bold text-[#121118] dark:text-white mb-2">
                  Contenido del Curso
                </h3>

                {videos.map((video, index) => {
                  const status = getVideoStatus(index);
                  const isCompleted = status === 'completed';
                  const isInProgress = status === 'in-progress';
                  const isLocked = status === 'locked';
                  const duration = video.topics?.reduce((sum, topic) => sum + (topic.duration || 0), 0) || 15;

                  return (
                    <div
                      key={video.id}
                      className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-xl border shadow-sm hover:shadow-md transition-all ${
                        isCompleted
                          ? 'border-l-4 border-l-primary border-y border-r border-[#ebeaf0] dark:border-gray-700'
                          : 'border border-[#ebeaf0] dark:border-gray-700'
                      } ${isLocked ? 'opacity-80 hover:opacity-100' : ''}`}
                    >
                      {/* Decorative Circle (only for first/active item) */}
                      {isCompleted && (
                        <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-[#f8f8fa] hidden sm:block"></div>
                      )}

                      <div className="flex items-center gap-4 w-full">
                        {/* Thumbnail */}
                        <div className="shrink-0 relative">
                          <div
                            className={`h-20 w-32 rounded-lg bg-gray-200 bg-cover bg-center shadow-inner ${
                              isLocked ? 'grayscale opacity-60' : 'group-hover:grayscale-0'
                            } transition-all duration-300`}
                            style={{
                              backgroundImage: video.thumbnailUrl ? `url(${video.thumbnailUrl})` : 'none',
                            }}
                          >
                            {!video.thumbnailUrl && (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${isLocked ? 'bg-gray-900/10' : 'bg-black/20 group-hover:bg-black/10'} transition-colors`}>
                            {isLocked ? (
                              <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 1110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 gap-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-black tracking-widest uppercase ${isLocked ? 'text-[#636085] dark:text-gray-500' : 'text-primary dark:text-blue-300'}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {getStatusBadge(status)}
                          </div>
                          <p className={`text-base font-bold line-clamp-1 transition-colors ${isLocked ? 'text-[#121118] dark:text-white' : 'text-[#121118] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400'}`}>
                            {video.title}
                          </p>
                          <p className="text-[#636085] dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {duration} min
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0 mt-3 sm:mt-0 w-full sm:w-auto">
                          {isCompleted && (
                            <button
                              onClick={() => navigate(`/topic/${video.topics?.[0]?.id || video.id}`)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg h-9 px-5 bg-[#ebeaf0] dark:bg-gray-800 text-[#121118] dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition-all text-sm font-bold shadow-sm"
                            >
                              <span>Repasar</span>
                            </button>
                          )}
                          {isInProgress && (
                            <button
                              onClick={() => navigate(`/topic/${video.topics?.[0]?.id || video.id}`)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg h-9 px-6 bg-accent text-white hover:bg-[#a0252c] transition-all text-sm font-bold shadow-md shadow-red-900/10"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              <span>Ver</span>
                            </button>
                          )}
                          {isLocked && (
                            <button
                              disabled
                              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg h-9 px-5 bg-transparent border border-[#d7d6e1] dark:border-gray-600 text-gray-400 cursor-not-allowed text-sm font-medium"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 1110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                              </svg>
                              <span className="hidden sm:inline">Bloqueado</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              {/* Progress Card */}
              <div className="bg-white dark:bg-background-dark rounded-xl p-6 border border-[#d7d6e1] dark:border-gray-700 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#121118] dark:text-white">Tu Progreso</h3>
                  <span className="text-primary dark:text-blue-300 font-bold text-lg">
                    {progressPercentage}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[#636085] dark:text-gray-400">
                  Has completado <span className="text-[#121118] dark:text-white font-bold">{completedCount}</span> de{' '}
                  <span className="text-[#121118] dark:text-white font-bold">{videos.length}</span> lecciones.
                </p>
              </div>

              {/* Instructor Card */}
              <div className="bg-white dark:bg-background-dark rounded-xl p-6 border border-[#d7d6e1] dark:border-gray-700 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm uppercase tracking-wider text-[#636085] dark:text-gray-400 font-bold">
                  Instructor
                </h3>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold ring-2 ring-primary/10">
                    JP
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-[#121118] dark:text-white">Juan Pérez</p>
                    <p className="text-sm text-[#636085] dark:text-gray-400">Director de Ventas Global</p>
                  </div>
                </div>
                <p className="text-sm text-[#636085] dark:text-gray-300 leading-relaxed border-t border-[#ebeaf0] dark:border-gray-700 pt-4 mt-1">
                  Experto en negociación con más de 15 años liderando equipos en Fortune 500.
                </p>
              </div>

              {/* Related Links */}
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/10 dark:border-primary/20 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-primary dark:text-blue-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Recursos Adicionales
                </h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-[#636085] dark:text-gray-400 hover:text-primary dark:hover:text-white hover:underline decoration-1 underline-offset-4 decoration-primary/50 transition-all flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      PDF: Guía de Objeciones
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-[#636085] dark:text-gray-400 hover:text-primary dark:hover:text-white hover:underline decoration-1 underline-offset-4 decoration-primary/50 transition-all flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      Plantilla de Email Frío
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
