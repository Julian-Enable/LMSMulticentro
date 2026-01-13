import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Tag, CheckCircle, XCircle, Clock } from 'lucide-react';
import { topicService } from '../services/topic.service';
import { Topic } from '../types';
import { formatTimestamp, getVideoUrl } from '../utils/helpers';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';

const TopicPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  useEffect(() => {
    if (id) {
      loadTopic(id);
    }
  }, [id]);

  const loadTopic = async (topicId: string) => {
    setLoading(true);
    try {
      const data = await topicService.getById(topicId);
      setTopic(data);
    } catch (error) {
      console.error('Error loading topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = async (direction: 'previous' | 'next') => {
    if (!id) return;

    try {
      const navigationData = await topicService.navigate(id, direction);
      if (navigationData && navigationData[`${direction}Topic`]) {
        navigate(`/topic/${navigationData[`${direction}Topic`].id}`);
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
    if (!topic?.quiz?.questions) return { correct: 0, total: 0 };

    const correct = topic.quiz.questions.filter(
      (q) => q.options.find((o) => o.id === quizAnswers[q.id])?.isCorrect
    ).length;

    return { correct, total: topic.quiz.questions.length };
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Cargando tema...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tema no encontrado</h2>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const videoUrl = getVideoUrl(topic.video);
  const score = showQuizResults ? getQuizScore() : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-primary-600">
          Inicio
        </Link>
        <span>/</span>
        {topic.video?.category && (
          <>
            <Link to={`/course/${topic.video.category.id}`} className="hover:text-primary-600">
              {topic.video.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{topic.code}</span>
      </nav>

      {/* Video Player */}
      <div className="card">
        <VideoPlayer url={videoUrl} startTime={topic.timestamp} />
      </div>

      {/* Topic Info */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-700 bg-primary-100 rounded">
                {topic.code}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTimestamp(topic.timestamp)}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
          </div>
        </div>

        {topic.description && (
          <p className="text-gray-700 mb-4 leading-relaxed">{topic.description}</p>
        )}

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-gray-400" />
            {topic.tags.map((topicTag) => (
              <span
                key={topicTag.tag.id}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {topicTag.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Video Info */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">Video:</span> {topic.video?.title}
            </div>
            {topic.video?.category && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {topic.video.category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      {topic.quiz && topic.quiz.questions && topic.quiz.questions.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Evaluación</h2>

          <div className="space-y-6">
            {topic.quiz.questions.map((question, qIndex) => (
              <div key={question.id} className="border-b pb-6 last:border-b-0">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {qIndex + 1}. {question.question}
                </h3>

                <div className="space-y-2">
                  {question.options.map((option) => {
                    const isSelected = quizAnswers[question.id] === option.id;
                    const showCorrect = showQuizResults && option.isCorrect;
                    const showIncorrect = showQuizResults && isSelected && !option.isCorrect;

                    return (
                      <button
                        key={option.id}
                        onClick={() => !showQuizResults && handleQuizAnswer(question.id, option.id)}
                        disabled={showQuizResults}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                          showCorrect
                            ? 'border-green-500 bg-green-50'
                            : showIncorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${showQuizResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
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
              disabled={Object.keys(quizAnswers).length !== topic.quiz.questions.length}
              className="btn btn-primary mt-6 w-full md:w-auto"
            >
              Enviar respuestas
            </button>
          ) : (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resultado</h3>
              <p className="text-lg">
                Has obtenido {score?.correct} de {score?.total} respuestas correctas (
                {score ? Math.round((score.correct / score.total) * 100) : 0}%)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => handleNavigation('previous')}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Tema anterior</span>
        </button>

        <button
          onClick={() => handleNavigation('next')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <span>Tema siguiente</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopicPage;
