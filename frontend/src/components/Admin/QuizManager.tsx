import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import api from '../../services/api';
import { Quiz, Topic } from '../../types';

interface QuizFormData {
  title: string;
  description: string;
  topicId: string;
  questions: {
    id?: string;
    question: string;
    options: {
      id?: string;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    topicId: '',
    questions: [],
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quizzesRes, topicsRes] = await Promise.all([
        api.get('/quizzes'),
        api.get('/topics'),
      ]);
      setQuizzes(quizzesRes.data);
      setTopics(topicsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      topicId: '',
      questions: [
        {
          question: '',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
          ],
        },
      ],
    });
  };

  const handleEdit = async (quiz: Quiz) => {
    setEditingId(quiz.id);
    
    try {
      const { data } = await api.get(`/quizzes/${quiz.id}`);
      setFormData({
        title: data.title,
        description: data.description || '',
        topicId: data.topicId,
        questions: data.questions || [],
      });
    } catch (error) {
      console.error('Error loading quiz details:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.post('/quizzes', formData);
      } else if (editingId) {
        await api.put(`/quizzes/${editingId}`, formData);
      }

      setIsCreating(false);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error al guardar el quiz');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este quiz?')) {
      return;
    }

    try {
      await api.delete(`/quizzes/${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error al eliminar el quiz');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
          ],
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const updateQuestion = (index: number, question: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index].question = question;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex].text = text;
    setFormData({ ...formData, questions: newQuestions });
  };

  const toggleCorrect = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.forEach((opt, i) => {
      opt.isCorrect = i === optionIndex;
    });
    setFormData({ ...formData, questions: newQuestions });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Quizzes</h2>
        {!isCreating && !editingId && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Quiz</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="card bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isCreating ? 'Crear Nuevo Quiz' : 'Editar Quiz'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Ej: Evaluación Facturación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                className="input"
              >
                <option value="">Seleccionar tema</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.code} - {topic.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Preguntas</label>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar pregunta</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Pregunta {qIndex + 1}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, e.target.value)}
                      className="input mb-3"
                      placeholder="Escribe la pregunta..."
                    />

                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={option.isCorrect}
                            onChange={() => toggleCorrect(qIndex, oIndex)}
                            className="w-4 h-4 text-green-600"
                            title="Marcar como correcta"
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className="input flex-1"
                            placeholder={`Opción ${oIndex + 1}`}
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        + Agregar opción
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.topicId || formData.questions.length === 0}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
              <button onClick={handleCancel} className="btn btn-secondary flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div className="space-y-2">
        {quizzes.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">No hay quizzes creados</div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{quiz.question}</h3>
                  {quiz.explanation && (
                    <p className="text-sm text-gray-600 mb-2">{quiz.explanation}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Tema: {quiz.topic?.code} - {quiz.topic?.title}</span>
                    <span>{quiz.options?.length || 0} opciones</span>
                  </div>
                </div>

                {editingId !== quiz.id && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizManager;
