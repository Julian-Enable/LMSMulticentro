import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { CourseCardSkeleton, SkeletonBox } from '../components/UI/Skeletons';
import { motion } from 'framer-motion';
import { BookOpen, Video, Clock, TrendingUp, Award, PlayCircle } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuthStore();
  const { progressByCourse } = useProgressStore();

  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ['categories', 'featured'],
    queryFn: () => categoryService.getAll(true)
  });

  // Calculate stats
  const totalMinutes = categories.reduce((sum, category) => {
    if (!category.videos) return sum;
    const categoryMinutes = category.videos.reduce((videoSum, video) => {
      if (typeof video.duration === 'number') {
        return videoSum + (video.duration / 60);
      }
      return videoSum;
    }, 0);
    return sum + categoryMinutes;
  }, 0);

  const totalVideos = categories.reduce((sum, cat) => sum + (cat.videoCount || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.floor(totalMinutes % 60);
  const totalTimeDisplay = totalHours > 0 
    ? `${totalHours}h ${remainingMinutes}m` 
    : `${remainingMinutes}m`;

  // Calculate completed topics across all courses
  const allTopicIds = categories.flatMap(cat => 
    cat.videos?.flatMap(video => video.topics?.map(t => t.id) || []) || []
  );
  const completedCount = allTopicIds.filter(id => 
    Object.values(progressByCourse).some(progress => progress.has(id))
  ).length;
  const progressPercentage = allTopicIds.length > 0 
    ? Math.round((completedCount / allTopicIds.length) * 100) 
    : 0;

  // Prepare chart data - Videos por categoría para el resumen
  const categorySummary = categories.slice(0, 4).map(cat => ({
    name: cat.name,
    videos: cat.videoCount || 0,
    duration: cat.videos?.reduce((acc, v) => acc + (v.duration || 0), 0) || 0
  }));

  const stats = [
    { label: 'Total Cursos', value: categories.length, icon: BookOpen, color: 'primary', change: '+2 este mes' },
    { label: 'Videos', value: totalVideos, icon: Video, color: 'accent', change: `${totalTimeDisplay} contenido` },
    { label: 'Completados', value: completedCount, icon: Award, color: 'green', change: `${progressPercentage}% progreso` },
    { label: 'Horas', value: totalHours, icon: Clock, color: 'blue', change: 'de aprendizaje' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight">
              Bienvenido de vuelta, {user?.username}
            </h1>
            <p className="text-primary-400 dark:text-slate-400 mt-1">Aquí está el resumen de tu aprendizaje hoy.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/library"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-primary dark:text-slate-200 text-sm font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              Ver Biblioteca
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold shadow-lg shadow-accent-500/30 transition-all hover:-translate-y-0.5"
            >
              <TrendingUp className="w-5 h-5" />
              Buscar Contenido
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`h-12 w-12 rounded-xl bg-${stat.color}-50 dark:bg-slate-700 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              {loading ? (
                <SkeletonBox className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-black text-primary-700 dark:text-slate-100 tracking-tight">{stat.value}</p>
              )}
              <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Categories Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            Resumen de Categorías
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorySummary.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${index % 2 === 0 ? 'from-primary-100 to-primary-200 dark:from-slate-600 dark:to-slate-700' : 'from-accent-100 to-accent-200 dark:from-slate-600 dark:to-slate-700'} flex items-center justify-center`}>
                    <BookOpen className={`w-5 h-5 ${index % 2 === 0 ? 'text-primary-600 dark:text-slate-300' : 'text-accent-600 dark:text-slate-300'}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{cat.videos}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1 truncate" title={cat.name}>{cat.name}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {cat.duration > 0 ? `${Math.round(cat.duration / 60)} min` : 'Sin videos'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-12">
        <div className="flex items-center justify-between mb-6 mt-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-accent-500" />
            Explorar Cursos
          </h2>
          <Link to="/library" className="text-sm font-semibold text-primary hover:underline dark:text-slate-300">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[180px]">
            <div className="md:col-span-2 md:row-span-2"><CourseCardSkeleton /></div>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[180px]">
            {/* Large Feature Card */}
            {categories[0] && (
              <Link
                to={`/course/${categories[0].id}`}
                className="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 shadow-md hover:-translate-y-2 transition-all cursor-pointer bg-primary-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-800 to-primary-900 opacity-90 z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800')"}}></div>
                <div className="relative z-20 h-full flex flex-col justify-between p-8">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Destacado</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{categories[0].name}</h3>
                    <p className="text-gray-200 text-sm md:text-base max-w-md line-clamp-2">{categories[0].description}</p>
                    <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-medium">
                      <Video className="w-5 h-5" />
                      {categories[0].videoCount || 0} Videos
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Standard Cards */}
            {categories.slice(1, 5).map((category, index) => {
              const colors = [
                { bg: 'from-primary-50 to-white', icon: 'bg-primary-100 text-primary-600', badge: 'bg-primary-100 text-primary-700' },
                { bg: 'from-accent-50 to-white', icon: 'bg-accent-100 text-accent-500', badge: 'bg-accent-100 text-accent-700' },
                { bg: 'from-primary-50 to-white', icon: 'bg-primary-100 text-primary-700', badge: 'bg-primary-100 text-primary-800' },
                { bg: 'from-accent-50 to-white', icon: 'bg-accent-50 text-accent-600', badge: 'bg-accent-50 text-accent-700' }
              ];
              const color = colors[index] || colors[0];

              return (
                <Link
                  key={category.id}
                  to={`/course/${category.id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-sm hover:-translate-y-2 transition-all cursor-pointer bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} dark:from-slate-700 dark:to-slate-800 opacity-50`}></div>
                  <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                    <div className={`h-10 w-10 rounded-lg ${color.icon} dark:bg-slate-600 dark:text-slate-200 flex items-center justify-center mb-4`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">{category.name}</h3>
                      <p className="text-gray-500 dark:text-slate-400 text-xs mb-3 line-clamp-2">{category.description}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.badge} dark:bg-slate-600 dark:text-slate-200`}>
                        <Video className="w-3 h-3 mr-1" />
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
