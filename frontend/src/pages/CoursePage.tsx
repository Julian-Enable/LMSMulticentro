import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { categoryService } from '../services/category.service';
import { useProgressStore } from '../store/progressStore';
import { Category, Video, Topic } from '../types';
import { formatTimestamp } from '../utils/helpers';
import confetti from 'canvas-confetti';

const CoursePage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Zustand Global Progress State
  const { progressByCourse, initProgress, toggleComplete } = useProgressStore();
  const completedTopics = progressByCourse[categoryId || ''] || new Set<string>();
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (categoryId) {
      loadCategory(categoryId);
      initProgress(categoryId); // Zustand fetches API or reads Cache automatically
    }
  }, [categoryId, initProgress]);

  // Gamification: Confetti when course is 100% completed
  useEffect(() => {
    const topics = category?.videos?.flatMap(v => v.topics || []) || [];
    const progressPct = topics.length > 0 ? Math.round((completedTopics.size / topics.length) * 100) : 0;
    
    if (progressPct === 100 && !hasCelebrated && category && !loading) {
      setHasCelebrated(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#232752', '#92232a', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#232752', '#92232a', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [completedTopics.size, category, loading, hasCelebrated]);

  const loadCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const data = await categoryService.getById(categoryId);
      setCategory(data);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopicComplete = async (topicId: string) => {
    if (categoryId) {
       await toggleComplete(categoryId, topicId);
    }
  };

  const getAllTopics = (): Topic[] => {
    if (!category?.videos) return [];
    
    const topics: Topic[] = [];
    category.videos.forEach((video: Video) => {
      if (video.topics) {
        topics.push(...video.topics);
      }
    });
    
    // Sort by code
    return topics.sort((a, b) => {
      const [aMajor, aMinor] = a.code?.split('.').map(Number) || [0, 0];
      const [bMajor, bMinor] = b.code?.split('.').map(Number) || [0, 0];
      
      if (aMajor !== bMajor) return aMajor - bMajor;
      return aMinor - bMinor;
    });
  };

  const getProgress = () => {
    const topics = getAllTopics();
    if (topics.length === 0) return 0;
    return Math.round((completedTopics.size / topics.length) * 100);
  };

  const getNextTopic = (): Topic | null => {
    const topics = getAllTopics();
    return topics.find((topic) => !completedTopics.has(topic.id)) || null;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
        {/* Progress Card Skeleton */}
        <div className="card space-y-4 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-full"></div>
        </div>
        {/* Modules Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="card space-y-4 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-gray-100/80 dark:bg-slate-800 rounded-lg w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Curso no encontrado</h2>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const allTopics = getAllTopics();
  const progress = getProgress();
  const nextTopic = getNextTopic();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400 mb-4">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-slate-100 font-medium">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">{category.name}</h1>
        {category.description && <p className="text-gray-600 dark:text-slate-400">{category.description}</p>}
      </div>

      {/* Progress Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Progreso del Curso</h2>
            <p className="text-gray-600 dark:text-slate-400">
              {completedTopics.size} de {allTopics.length} temas completados
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{progress}%</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {nextTopic && (
          <div className="mt-4 pt-4 border-t dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Siguiente tema:</p>
            <Link
              to={`/topic/${nextTopic.id}`}
              className="btn btn-primary flex items-center justify-center space-x-2"
            >
              <PlayCircle className="w-5 h-5" />
              <span>
                {nextTopic.code}: {nextTopic.title}
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Topics List by Video */}
      <div className="space-y-6">
        {category.videos
          ?.slice().sort((a: Video, b: Video) => a.order - b.order)
          .map((video: Video, videoIndex: number, sortedVideos: Video[]) => {
          // A module is locked if the previous module has incomplete topics
          const isLocked = videoIndex > 0 && (() => {
            const prevTopics = sortedVideos[videoIndex - 1].topics ?? [];
            return prevTopics.some((t: Topic) => !completedTopics.has(t.id));
          })();

          return (
          <div key={video.id} className={`card transition-opacity ${isLocked ? 'opacity-60' : ''}`}>
            <div className="flex items-start mb-4">
              {isLocked
                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 dark:text-slate-500 mr-3 flex-shrink-0 mt-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                : <PlayCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0 mt-1" />
              }
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{video.title}</h3>
                {video.description && <p className="text-gray-600 dark:text-slate-400 mt-1">{video.description}</p>}
                {isLocked && <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Completá el módulo anterior para desbloquear</p>}
              </div>
            </div>

            {video.topics && video.topics.length > 0 ? (
              <div className="space-y-2">
                {video.topics
                  .sort((a, b) => {
                    const [aMajor, aMinor] = a.code?.split('.').map(Number) || [0, 0];
                    const [bMajor, bMinor] = b.code?.split('.').map(Number) || [0, 0];
                    if (aMajor !== bMajor) return aMajor - bMajor;
                    return aMinor - bMinor;
                  })
                  .map((topic) => {
                    const isCompleted = completedTopics.has(topic.id);

                    return (
                      <div
                        key={topic.id}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                          isLocked
                            ? 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 cursor-not-allowed'
                            : isCompleted
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-slate-700 hover:border-primary-500'
                        }`}
                      >
                        {isLocked ? (
                          <div className="flex-1 flex items-center space-x-3 opacity-50">
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400">{topic.code}</span>
                            <span className="font-medium text-gray-500 dark:text-slate-400">{topic.title}</span>
                          </div>
                        ) : (
                        <Link
                          to={`/topic/${topic.id}`}
                          className="flex-1 flex items-center space-x-3"
                        >
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                            }`}
                          >
                            {topic.code}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-slate-100">{topic.title}</span>
                          <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 ml-auto">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {topic.duration
                                ? formatTimestamp(topic.duration)
                                : 'Ver tema'}
                            </span>
                          </div>
                        </Link>
                        )}

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isLocked) toggleTopicComplete(topic.id);
                          }}
                          disabled={isLocked}
                          className={`ml-4 p-2 rounded-full transition-colors ${
                            isLocked
                              ? 'text-gray-300 dark:text-slate-600 cursor-not-allowed'
                              : isCompleted
                                ? 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                : 'text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                          title={isLocked ? 'Módulo bloqueado' : isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          {isLocked
                            ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            : <CheckCircle className="w-5 h-5" />
                          }
                        </button>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-slate-400 text-sm">No hay temas disponibles para este video</p>
            )}
          </div>
          );
        })}
      </div>

      {/* Completion */}
      {progress === 100 && (
        <div className="card text-center py-8 bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">¡Curso Completado!</h3>
          <p className="text-gray-700 dark:text-slate-300 mb-4">
            Has completado todos los temas de este curso. ¡Excelente trabajo!
          </p>
          <Link to="/" className="btn btn-primary">
            Explorar más cursos
          </Link>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
