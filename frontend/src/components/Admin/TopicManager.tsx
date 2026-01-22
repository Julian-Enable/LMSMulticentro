import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import api from '../../services/api';
import { Topic, Video, Tag } from '../../types';

const TopicManager = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    timestamp: 0,
    videoId: '',
    tagIds: [] as string[],
    isActive: true,
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [topicsRes, videosRes, tagsRes] = await Promise.all([
        api.get('/topics'),
        api.get('/videos'),
        api.get('/tags'),
      ]);
      setTopics(topicsRes.data);
      setVideos(videosRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      code: '',
      title: '',
      description: '',
      timestamp: 0,
      videoId: videos[0]?.id || '',
      tagIds: [],
      isActive: true,
    });
  };

  const handleEdit = async (topic: Topic) => {
    setEditingId(topic.id);
    
    // Fetch full topic details to get tags
    try {
      const { data } = await api.get(`/topics/${topic.id}`);
      setFormData({
        code: data.code,
        title: data.title,
        description: data.description || '',
        timestamp: data.timestamp,
        videoId: data.videoId,
        tagIds: data.tags?.map((t: any) => t.tag.id) || [],
        isActive: data.isActive,
      });
    } catch (error) {
      console.error('Error loading topic details:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.post('/topics', formData);
      } else if (editingId) {
        await api.put(`/topics/${editingId}`, formData);
      }

      setIsCreating(false);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Error al guardar el tema');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este tema?')) {
      return;
    }

    try {
      await api.delete(`/topics/${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error al eliminar el tema');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const toggleTag = (tagId: string) => {
    if (formData.tagIds.includes(tagId)) {
      setFormData({ ...formData, tagIds: formData.tagIds.filter((id) => id !== tagId) });
    } else {
      setFormData({ ...formData, tagIds: [...formData.tagIds, tagId] });
    }
  };

  const formatTimestampInput = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimestampInput = (value: string): number => {
    const parts = value.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      return mins * 60 + secs;
    }
    return parseInt(value) || 0;
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
        <h2 className="text-xl font-bold text-gray-900">Gestión de Temas</h2>
        {!isCreating && !editingId && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Tema</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="card bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isCreating ? 'Crear Nuevo Tema' : 'Editar Tema'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="input"
                  placeholder="Ej: 1.11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timestamp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatTimestampInput(formData.timestamp)}
                  onChange={(e) =>
                    setFormData({ ...formData, timestamp: parseTimestampInput(e.target.value) })
                  }
                  className="input"
                  placeholder="MM:SS (ej: 3:45)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Ej: Crear una nueva factura"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Descripción del tema..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.videoId}
                onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                className="input"
              >
                {videos.map((video) => (
                  <option key={video.id} value={video.id}>
                    {video.title} ({video.category?.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${
                      formData.tagIds.includes(tag.id)
                        ? 'border-primary-600 bg-primary-100 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="topicIsActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="topicIsActive" className="ml-2 text-sm text-gray-700">
                Tema activo
              </label>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={!formData.code || !formData.title || !formData.videoId}
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

      {/* Topics List */}
      <div className="space-y-2">
        {topics.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">No hay temas creados</div>
        ) : (
          topics
            .sort((a, b) => {
              const [aMajor, aMinor] = a.code?.split('.').map(Number) || [0, 0];
              const [bMajor, bMinor] = b.code?.split('.').map(Number) || [0, 0];
              if (aMajor !== bMajor) return aMajor - bMajor;
              return aMinor - bMinor;
            })
            .map((topic) => (
              <div key={topic.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700 rounded">
                        {topic.code}
                      </span>
                      <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          topic.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {topic.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    {topic.description && (
                      <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Video: {topic.video?.title}</span>
                      <span>Timestamp: {formatTimestampInput(topic.timestamp)}</span>
                    </div>
                  </div>

                  {editingId !== topic.id && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
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

export default TopicManager;
