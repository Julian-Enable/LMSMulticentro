import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import api from '../../services/api';
import { Quiz, Topic } from '../../types';

interface QuizFormData {
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  order: number;
  isActive: boolean;
}

const emptyForm = (): QuizFormData => ({
  topicId: '',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  order: 0,
  isActive: true,
});

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<QuizFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [filterTopicId, setFilterTopicId] = useState('');

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
    setEditingId(null);
    setFormData(emptyForm());
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setIsCreating(false);
    setFormData({
      topicId: quiz.topicId,
      question: quiz.question,
      options: quiz.options.length >= 2 ? [...quiz.options] : [...quiz.options, '', ''].slice(0, Math.max(quiz.options.length, 2)),
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation || '',
      order: quiz.order,
      isActive: quiz.isActive,
    });
  };

  const handleSave = async () => {
    if (!formData.topicId || !formData.question.trim()) return;
    const filledOptions = formData.options.filter(o => o.trim());
    if (filledOptions.length < 2) {
      alert('Debes ingresar al menos 2 opciones');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        topicId: formData.topicId,
        question: formData.question.trim(),
        options: filledOptions,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation.trim() || undefined,
        order: formData.order,
        isActive: formData.isActive,
      };

      if (isCreating) {
        await api.post('/quizzes', payload);
      } else if (editingId) {
        await api.put(`/quizzes/${editingId}`, payload);
      }

      setIsCreating(false);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error al guardar la pregunta');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error al eliminar la pregunta');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const updateOption = (index: number, value: string) => {
    const opts = [...formData.options];
    opts[index] = value;
    setFormData({ ...formData, options: opts });
  };

  const addOption = () => {
    if (formData.options.length >= 6) return;
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return;
    const opts = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: opts,
      correctAnswer: formData.correctAnswer >= opts.length ? 0 : formData.correctAnswer,
    });
  };

  const filteredQuizzes = filterTopicId
    ? quizzes.filter(q => q.topicId === filterTopicId)
    : quizzes;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Cuestionarios</h2>
          <p className="text-sm text-slate-500">{quizzes.length} preguntas en total</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Pregunta
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-gray-900">
            {isCreating ? 'Nueva Pregunta' : 'Editar Pregunta'}
          </h3>

          {/* Topic selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tema <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar tema...</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.code} — {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pregunta <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Escribe la pregunta..."
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Opciones <span className="text-xs text-slate-500 font-normal">(selecciona la correcta con el radio)</span>
              </label>
              <button
                type="button"
                onClick={addOption}
                disabled={formData.options.length >= 6}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-40"
              >
                + Agregar opción
              </button>
            </div>
            <div className="space-y-2">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === i}
                    onChange={() => setFormData({ ...formData, correctAnswer: i })}
                    className="w-4 h-4 accent-green-600"
                    title="Marcar como correcta"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className={`flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      formData.correctAnswer === i ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                    placeholder={`Opción ${i + 1}${formData.correctAnswer === i ? ' ✓ correcta' : ''}`}
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Explicación <span className="text-xs text-slate-400 font-normal">(opcional — se muestra al responder)</span>
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Explica por qué la respuesta es correcta..."
            />
          </div>

          {/* Order + Active */}
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={0}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-primary-600"
              />
              <span className="text-sm font-semibold text-gray-700">Activa</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving || !formData.topicId || !formData.question.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filter by topic */}
      {!isCreating && !editingId && quizzes.length > 0 && (
        <select
          value={filterTopicId}
          onChange={(e) => setFilterTopicId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos los temas</option>
          {topics
            .filter(t => quizzes.some(q => q.topicId === t.id))
            .map(t => (
              <option key={t.id} value={t.id}>{t.code} — {t.title}</option>
            ))}
        </select>
      )}

      {/* Quizzes list */}
      <div className="space-y-3">
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl text-center py-12 text-slate-500">
            {quizzes.length === 0 ? 'No hay preguntas creadas aún' : 'No hay preguntas para el filtro seleccionado'}
          </div>
        ) : (
          filteredQuizzes.map((quiz, idx) => (
            <div key={quiz.id} className={`bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow ${!quiz.isActive ? 'opacity-60' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 mb-2">{quiz.question}</p>
                  <div className="space-y-1 mb-2">
                    {quiz.options.map((option, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                          i === quiz.correctAnswer
                            ? 'bg-green-50 text-green-800 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        {i === quiz.correctAnswer && (
                          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                  {quiz.explanation && (
                    <p className="text-xs text-slate-500 italic mt-1">💡 {quiz.explanation}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span>Tema: {quiz.topic?.code} — {quiz.topic?.title}</span>
                    {!quiz.isActive && <span className="text-orange-500 font-semibold">Inactiva</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(quiz)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizManager;