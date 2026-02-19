import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { categoryService } from '../services/category.service';
import { progressService } from '../services/progress.service';
import { Category, Video, Topic } from '../types';
import { formatTimestamp } from '../utils/helpers';

const CoursePage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (categoryId) {
      loadCategory(categoryId);
      loadProgress(categoryId);
    }
  }, [categoryId]);

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

  const loadProgress = async (categoryId: string) => {
    // Try backend first, fall back to localStorage
    try {
      const completedIds = await progressService.getCategoryProgress(categoryId);
      setCompletedTopics(new Set(completedIds));
      // Update localStorage cache
      localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(completedIds));
    } catch {
      // Fallback: load from localStorage
      const saved = localStorage.getItem(`course-progress-${categoryId}`);
      if (saved) {
        setCompletedTopics(new Set(JSON.parse(saved)));
      }
    }
  };

  const toggleTopicComplete = async (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    const wasCompleted = newCompleted.has(topicId);

    if (wasCompleted) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);

    // Update localStorage cache
    if (categoryId) {
      localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(Array.from(newCompleted)));
    }

    // Persist to backend
    try {
      if (wasCompleted) {
        await progressService.unmarkComplete(topicId);
      } else {
        await progressService.markComplete(topicId);
      }
    } catch {
      // Revert on error
      setCompletedTopics(completedTopics);
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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Cargando curso...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
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
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-primary-600">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && <p className="text-gray-600">{category.description}</p>}
      </div>

      {/* Progress Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Progreso del Curso</h2>
            <p className="text-gray-600">
              {completedTopics.size} de {allTopics.length} temas completados
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{progress}%</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {nextTopic && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Siguiente tema:</p>
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
        {category.videos?.map((video: Video) => (
          <div key={video.id} className="card">
            <div className="flex items-start mb-4">
              <PlayCircle className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{video.title}</h3>
                {video.description && <p className="text-gray-600 mt-1">{video.description}</p>}
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
                          isCompleted
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-primary-500'
                        }`}
                      >
                        <Link
                          to={`/topic/${topic.id}`}
                          className="flex-1 flex items-center space-x-3"
                        >
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-primary-100 text-primary-700'
                            }`}
                          >
                            {topic.code}
                          </span>
                          <span className="font-medium text-gray-900">{topic.title}</span>
                          <div className="flex items-center text-sm text-gray-500 ml-auto">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {topic.duration
                                ? formatTimestamp(topic.duration)
                                : 'Ver tema'}
                            </span>
                          </div>
                        </Link>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleTopicComplete(topic.id);
                          }}
                          className={`ml-4 p-2 rounded-full transition-colors ${
                            isCompleted
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay temas disponibles para este video</p>
            )}
          </div>
        ))}
      </div>

      {/* Completion */}
      {progress === 100 && (
        <div className="card text-center py-8 bg-green-50 border-2 border-green-500">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Curso Completado!</h3>
          <p className="text-gray-700 mb-4">
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
