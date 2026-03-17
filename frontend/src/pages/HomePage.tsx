import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { CourseCardSkeleton } from '../components/UI/Skeletons';
import { motion } from 'framer-motion';
import { BookOpen, Video, Clock, Award, ArrowRight, Play, Sparkles } from 'lucide-react';

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

  const allTopicIds = categories.flatMap(cat => 
    cat.videos?.flatMap(video => video.topics?.map(t => t.id) || []) || []
  );
  const completedCount = allTopicIds.filter(id => 
    Object.values(progressByCourse).some(progress => progress.has(id))
  ).length;
  const progressPercentage = allTopicIds.length > 0 
    ? Math.round((completedCount / allTopicIds.length) * 100) 
    : 0;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
        
        {/* Hero Section - Compact & Clean */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
        >
          <div>
            <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-1">{greeting},</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {user?.username || 'Usuario'}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
              Continúa donde lo dejaste o explora nuevo contenido.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/library"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all shadow-sm"
            >
              Biblioteca
            </Link>
            <Link
              to="/search"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-sm"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Explorar
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Stats - Horizontal Bar Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100 dark:divide-slate-700">
            {[
              { label: 'Cursos', value: loading ? '—' : categories.length, sub: 'disponibles', icon: BookOpen, accent: 'text-blue-500' },
              { label: 'Videos', value: loading ? '—' : totalVideos, sub: totalTimeDisplay, icon: Video, accent: 'text-violet-500' },
              { label: 'Completados', value: loading ? '—' : completedCount, sub: `${progressPercentage}%`, icon: Award, accent: 'text-emerald-500' },
              { label: 'Tiempo', value: loading ? '—' : (totalHours > 0 ? `${totalHours}h` : `${Math.floor(totalMinutes)}m`), sub: 'de contenido', icon: Clock, accent: 'text-amber-500' },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-5 flex items-center gap-4">
                <div className={`${stat.accent} opacity-80`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{stat.value}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    {stat.label} · <span className="text-gray-500 dark:text-slate-400">{stat.sub}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Banner (if user has progress) */}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Progreso general: {progressPercentage}%</p>
                <p className="text-primary-200 text-sm">{completedCount} de {allTopicIds.length} temas completados</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPercentage}%` }} />
              </div>
              <span className="text-white font-bold text-sm">{progressPercentage}%</span>
            </div>
          </motion.div>
        )}

        {/* Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tus Cursos</h2>
            <Link to="/library" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-slate-400 font-medium">No hay cursos disponibles aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((category, index) => {
                // Calculate progress for this specific course
                const courseTopicIds = category.videos?.flatMap(v => v.topics?.map(t => t.id) || []) || [];
                const courseCompleted = courseTopicIds.filter(id =>
                  Object.values(progressByCourse).some(progress => progress.has(id))
                ).length;
                const courseProgress = courseTopicIds.length > 0
                  ? Math.round((courseCompleted / courseTopicIds.length) * 100)
                  : 0;

                const colorSchemes = [
                  { gradient: 'from-blue-600 to-indigo-700', light: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                  { gradient: 'from-violet-600 to-purple-700', light: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
                  { gradient: 'from-emerald-600 to-teal-700', light: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
                  { gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
                  { gradient: 'from-rose-500 to-pink-600', light: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
                  { gradient: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400' },
                ];
                const scheme = colorSchemes[index % colorSchemes.length];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                  >
                    <Link
                      to={`/course/${category.id}`}
                      className="group block bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                    >
                      {/* Color strip */}
                      <div className={`h-1.5 bg-gradient-to-r ${scheme.gradient}`} />
                      
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg ${scheme.light} flex items-center justify-center`}>
                            <BookOpen className="w-5 h-5" />
                          </div>
                          {index === 0 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                              Destacado
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {category.name}
                        </h3>
                        
                        {category.description && (
                          <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
                            {category.description}
                          </p>
                        )}

                        {/* Bottom row */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700/50">
                          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5" />
                              {category.videoCount || 0}
                            </span>
                            {category.videos && category.videos.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {Math.round((category.videos.reduce((sum, v) => sum + (v.duration || 0), 0)) / 60)}m
                              </span>
                            )}
                          </div>
                          
                          {/* Progress indicator */}
                          {courseProgress > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r ${scheme.gradient} transition-all`} 
                                  style={{ width: `${courseProgress}%` }} 
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">{courseProgress}%</span>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              Empezar <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default HomePage;
