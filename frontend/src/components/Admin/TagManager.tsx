import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import api from '../../services/api';
import { Tag } from '../../types';

const TagManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tags');
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ name: '' });
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setFormData({ name: tag.name });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.post('/tags', formData);
      } else if (editingId) {
        await api.put(`/tags/${editingId}`, formData);
      }

      setIsCreating(false);
      setEditingId(null);
      setFormData({ name: '' });
      await loadTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert('Error al guardar el tag');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este tag?')) {
      return;
    }

    try {
      await api.delete(`/tags/${id}`);
      await loadTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Error al eliminar el tag');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '' });
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
        <h2 className="text-xl font-bold text-gray-900">Gestión de Tags</h2>
        {!isCreating && !editingId && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Tag</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="card bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isCreating ? 'Crear Nuevo Tag' : 'Editar Tag'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Ej: error_404, factura_anulada"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usa snake_case para tags de error: error_404, error_conexion, etc.
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={!formData.name}
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

      {/* Tags List */}
      <div className="flex flex-wrap gap-3">
        {tags.length === 0 ? (
          <div className="card w-full text-center py-8 text-gray-500">No hay tags creados</div>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-900">{tag.name}</span>
              <span className="text-xs text-gray-500">({tag.topicCount || 0})</span>

              {editingId !== tag.id && (
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TagManager;
