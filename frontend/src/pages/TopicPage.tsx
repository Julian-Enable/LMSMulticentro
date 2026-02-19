import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { topicService } from '../services/topic.service';
import { progressService } from '../services/progress.service';
import { Topic } from '../types';
import { formatTimestamp, getVideoUrl } from '../utils/helpers';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';

const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'temario' | 'materiales'>('temario');
  const [expandedDescription, setExpandedDescription] = useState(false);

  useEffect(() => {
    if (topicId) {
      loadTopic(topicId);
    } else {
      setError('No se proporcionó ID del tema');
      setLoading(false);
    }
  }, [topicId]);

  const loadTopic = async (topicId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await topicService.getById(topicId);
      setTopic(data);
      
      // Increment views after loading
      try {
        await topicService.incrementViews(topicId);
      } catch (viewError) {
        console.error('Error incrementing views:', viewError);
        // Don't fail the whole page if view increment fails
      }
    } catch (error: any) {
      console.error('Error loading topic:', error);
      setError(error?.response?.data?.message || 'No se pudo cargar el tema. Verifica que el tema existe y que tienes permisos para acceder.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = async () => {
    if (!topicId) return;
    // Mark topic as completed in the backend
    try {
      await progressService.markComplete(topicId);
    } catch {
      // fail silently — backend unavailable
    }
    // Also update localStorage as cache
    if (topic?.video?.category?.id) {
      const categoryId = topic.video.category.id;
      const saved = localStorage.getItem(`course-progress-${categoryId}`);
      const completedTopics = saved ? new Set(JSON.parse(saved)) : new Set();
      completedTopics.add(topicId);
      localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(Array.from(completedTopics)));
    }
  };

  const handleNavigation = async (direction: 'previous' | 'next') => {
    if (!topicId) return;

    try {
      const navigationData = direction === 'next' 
        ? await topicService.getNext(topicId)
        : await topicService.getPrevious(topicId);
      if (navigationData && navigationData.id) {
        navigate(`/topic/${navigationData.id}`);
      }
    } catch (error) {
      console.error(`Error navigating to ${direction} topic:`, error);
    }
  };

  const handleQuizAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const submitQuiz = () => {
    setShowQuizResults(true);
  };

  const getQuizScore = () => {
    if (!topic?.quizzes || topic.quizzes.length === 0) return { correct: 0, total: 0 };

    const correct = topic.quizzes.filter(
      (q: any) => {
        const answerIndex = parseInt(quizAnswers[q.id] || '-1');
        return answerIndex === q.correctAnswer;
      }
    ).length;

    return { correct, total: topic.quizzes.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h2 className="text-xl font-bold text-red-800 mb-2">Error al cargar el tema</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/biblioteca')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold"
              >
                Ir a Biblioteca
              </button>
              <button
                onClick={() => navigate('/administrar')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Administrar Contenido
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Asegúrate de crear temas para tus videos desde el panel de <strong>Administrar → Temas</strong>
          </p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tema no encontrado</h2>
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const videoUrl = topic.video ? getVideoUrl(topic.video.platform, topic.video.externalId) : '';
  const score = showQuizResults ? getQuizScore() : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Breadcrumbs */}
      <div className="px-6 py-4 flex flex-wrap gap-2 items-center text-sm border-b border-gray-200 bg-white shrink-0">
        <Link to="/" className="text-gray-600 hover:text-primary-700 font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver {topic.video?.category ? `a ${topic.video.category.name}` : ''}
        </Link>
        <span className="text-gray-400 mx-2">|</span>
        {topic.video?.category && (
          <>
            <Link to={`/course/${topic.video.category.id}`} className="text-gray-600 hover:text-primary-700 font-medium">
              Curso: {topic.video.category.name}
            </Link>
            <span className="text-gray-600 font-medium">/</span>
          </>
        )}
        <span className="text-gray-900 font-bold">{topic.code}</span>
      </div>

      {/* Content Grid (70/30) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto min-h-full">
          <div className="flex flex-col xl:flex-row gap-6 px-4 md:px-6 py-6 pb-10 flex-1">
            {/* Left Column: Video & Details (70%) */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Video Player Container */}
              <div className="bg-black rounded-xl overflow-hidden shadow-lg">
                <VideoPlayer 
                  url={videoUrl} 
                  startTime={topic.timestamp}
                  onEnded={handleVideoEnd}
                />
              </div>

              {/* Video Info */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 text-2xl md:text-3xl font-extrabold leading-tight">{topic.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {topic.views || 0} vistas
                      </span>
                      <span>•</span>
                      <span>Publicado {new Date(topic.createdAt || Date.now()).toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}</span>
                      {topic.video?.category && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wide">
                            {topic.video.category.name}
                          </span>
                        </>
                      )}
                      <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wide">
                        {topic.code}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 hover:text-primary-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                      </svg>
                      <span className="hidden sm:inline">Me gusta</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 hover:text-primary-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      <span className="hidden sm:inline">Compartir</span>
                    </button>
                    <button 
                      className="flex items-center justify-center size-10 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors" 
                      title="Reportar problema"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Description */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-900 text-lg font-bold mb-3">Sobre esta lección</h3>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {topic.description ? (
                      <p className={`leading-relaxed ${!expandedDescription ? 'line-clamp-3' : ''}`}>
                        {topic.description}
                      </p>
                    ) : (
                      <p className="leading-relaxed">
                        En este módulo aprenderás sobre {topic.title}. Contenido diseñado para mejorar tus habilidades y conocimientos en el área.
                      </p>
                    )}

                    {/* Tags */}
                    {topic.tags && topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <strong className="text-gray-900">Etiquetas:</strong>
                        {topic.tags.map((topicTag) => (
                          <span key={topicTag.tag.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            {topicTag.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setExpandedDescription(!expandedDescription)}
                    className="text-primary text-sm font-bold flex items-center gap-1 mt-2 hover:underline"
                  >
                    {expandedDescription ? 'Ver menos' : 'Ver más'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-[18px] h-[18px] transition-transform ${expandedDescription ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>

                {/* Comment/Notes Section */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-bold text-sm">Tus notas personales</h4>
                    <p className="text-gray-600 text-xs">Agrega notas en momentos específicos del video para repasar luego.</p>
                  </div>
                  <button className="text-primary text-sm font-bold hover:underline">Abrir Notas</button>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar (30%) */}
            <div className="w-full xl:w-[380px] flex-none flex flex-col gap-6">
              {/* Topics Panel */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden sticky top-4 max-h-[calc(100vh-2rem)]">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button 
                    onClick={() => setActiveTab('temario')}
                    className={`flex-1 py-4 text-center text-sm font-bold transition-colors ${
                      activeTab === 'temario' 
                        ? 'text-primary border-b-2 border-primary bg-primary/5' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Temario
                  </button>
                  <button 
                    onClick={() => setActiveTab('materiales')}
                    className={`flex-1 py-4 text-center text-sm font-bold transition-colors ${
                      activeTab === 'materiales' 
                        ? 'text-primary border-b-2 border-primary bg-primary/5' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Materiales
                  </button>
                </div>

                {/* Progress Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso del módulo</span>
                    <span className="text-sm font-bold text-primary">
                      {topic.video?.topics && topic.video.topics.length > 0
                        ? Math.round(((topic.order + 1) / topic.video.topics.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${topic.video?.topics && topic.video.topics.length > 0 
                          ? Math.round(((topic.order + 1) / topic.video.topics.length) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Topics List */}
                {activeTab === 'temario' ? (
                  <div className="overflow-y-auto flex-1 p-2 space-y-1" style={{ maxHeight: '500px' }}>
                    {/* Current Topic - Active */}
                    <div className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 relative group cursor-pointer transition-all">
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r"></div>
                      <div className="mt-1 ml-2 text-primary animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-primary text-sm font-bold">{topic.title}</span>
                        <span className="text-primary text-xs font-mono font-bold mt-1 bg-white inline-block px-1.5 py-0.5 rounded shadow-sm w-fit">
                          {topic.duration 
                            ? formatTimestamp(topic.duration)
                            : topic.video?.topics && topic.video.topics.length === 1 && topic.video.duration
                              ? formatTimestamp(topic.video.duration)
                              : 'Ver tema'}
                        </span>
                      </div>
                    </div>

                    {/* Placeholder for other topics */}
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Otros temas del módulo aparecerán aquí
                    </div>
                  </div>
                ) : (
                  <div className="overflow-y-auto flex-1 p-4" style={{ maxHeight: '500px' }}>
                    <div className="text-center py-12 text-gray-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mx-auto mb-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p>Materiales disponibles próximamente</p>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
                  {topic.quizzes && topic.quizzes.length > 0 && (
                    <button 
                      onClick={() => {
                        const quizSection = document.getElementById('quiz-section');
                        quizSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-3 px-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-bold text-sm shadow-md transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      Tomar Examen
                    </button>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <button 
                      onClick={() => handleNavigation('previous')}
                      className="flex-1 py-2 px-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:text-primary-700 hover:border-primary/30 hover:bg-gray-100 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      Anterior
                    </button>
                    <button 
                      onClick={() => handleNavigation('next')}
                      className="flex-1 py-2 px-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:text-primary-700 hover:border-primary/30 hover:bg-gray-100 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      Siguiente
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Promo / Help Card */}
              <div className="bg-gradient-to-br from-primary to-gray-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <h4 className="font-bold text-lg relative z-10">¿Tienes dudas?</h4>
                <p className="text-white/80 text-sm mt-1 mb-4 relative z-10">Consulta con tu instructor o revisa el foro de discusión.</p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
                  Ir al Foro
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          {topic.quizzes && topic.quizzes.length > 0 && (
            <div id="quiz-section" className="px-4 md:px-6 pb-10 max-w-4xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Evaluación</h2>

                <div className="space-y-6">
                  {topic.quizzes.map((question: any, qIndex: number) => (
                    <div key={question.id} className="border-b pb-6 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {qIndex + 1}. {question.question}
                      </h3>

                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => {
                          const isSelected = quizAnswers[question.id] === optionIndex.toString();
                          const showCorrect = showQuizResults && optionIndex === question.correctAnswer;
                          const showIncorrect = showQuizResults && isSelected && optionIndex !== question.correctAnswer;

                          return (
                            <button
                              key={optionIndex}
                              onClick={() => !showQuizResults && handleQuizAnswer(question.id, optionIndex.toString())}
                              disabled={showQuizResults}
                              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                                showCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : showIncorrect
                                  ? 'border-red-500 bg-red-50'
                                  : isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              } ${showQuizResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {showCorrect && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {showIncorrect && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {!showQuizResults ? (
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length !== topic.quizzes.length}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar respuestas
                  </button>
                ) : (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Resultado</h3>
                    <p className="text-lg">
                      Has obtenido {score?.correct} de {score?.total} respuestas correctas (
                      {score ? Math.round((score.correct / score.total) * 100) : 0}%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
