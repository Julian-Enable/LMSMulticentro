import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import api from '../../services/api';
import { Video, Category } from '../../types';

const VideoManager = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    platform: 'YOUTUBE' as 'YOUTUBE' | 'DRIVE' | 'VIMEO' | 'OTHER',
    categoryId: '',
    isActive: true,
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [videosRes, categoriesRes] = await Promise.all([
        api.get('/videos'),
        api.get('/categories?includeInactive=true'),
      ]);
      setVideos(videosRes.data);
      setCategories(categoriesRes.data);
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
      url: '',
      platform: 'YOUTUBE',
      categoryId: categories[0]?.id || '',
      isActive: true,
    });
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    const platformMap: any = {
      'GOOGLE_DRIVE': 'DRIVE',
      'YOUTUBE': 'YOUTUBE',
      'VIMEO': 'VIMEO'
    };
    setFormData({
      title: video.title,
      description: video.description || '',
      url: video.externalId,
      platform: platformMap[video.platform] || 'OTHER',
      categoryId: video.categoryId,
      isActive: video.isActive,
    });
  };

  const handleSave = async () => {
    try {
      const platformMap: any = {
        'DRIVE': 'GOOGLE_DRIVE',
        'YOUTUBE': 'YOUTUBE',
        'VIMEO': 'VIMEO',
        'OTHER': 'YOUTUBE'
      };
      const dataToSend = {
        ...formData,
        externalId: formData.url,
        platform: platformMap[formData.platform]
      };
      if (isCreating) {
        await api.post('/videos', dataToSend);
      } else if (editingId) {
        await api.put(`/videos/${editingId}`, dataToSend);
      }

      setIsCreating(false);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Error al guardar el video');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este video? Se eliminarán todos sus temas.')) {
      return;
    }

    try {
      await api.delete(`/videos/${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error al eliminar el video');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
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
        <h2 className="text-xl font-bold text-gray-900">Gestión de Videos</h2>
        {!isCreating && !editingId && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Video</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="card bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isCreating ? 'Crear Nuevo Video' : 'Editar Video'}
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
                placeholder="Ej: Tutorial de Facturación Parte 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Descripción del video..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Video <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="input"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as typeof formData.platform,
                    })
                  }
                  className="input"
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="DRIVE">Google Drive</option>
                  <option value="VIMEO">Vimeo</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="videoIsActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="videoIsActive" className="ml-2 text-sm text-gray-700">
                Video activo
              </label>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.url || !formData.categoryId}
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

      {/* Videos List */}
      <div className="space-y-2">
        {videos.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">No hay videos creados</div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {video.platform}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        video.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {video.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Categoría: {video.category?.name}</span>
                    <span>{video.topicCount || video.topics?.length || 0} temas</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{video.externalId}</p>
                </div>

                {editingId !== video.id && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
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

export default VideoManager;
