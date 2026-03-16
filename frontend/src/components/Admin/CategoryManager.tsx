import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import { roleService } from '../../services/role.service';
import { Category } from '../../types';
import ConfirmModal from '../UI/ConfirmModal';
import { SkeletonBox } from '../UI/Skeletons';

const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    isActive: true,
    allowedRoles: [] as string[]
  });
  const [isCreating, setIsCreating] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories', 'admin'],
    queryFn: () => categoryService.getAllAdmin()
  });

  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAll(true)
  });

  const loading = loadingCategories || loadingRoles;

  const createMutation = useMutation({
    mutationFn: (data: any) => categoryService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => categoryService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ name: '', description: '', isActive: true, allowedRoles: [] });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
      allowedRoles: category.categoryRoles?.map(cr => cr.roleId) || [],
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await createMutation.mutateAsync(formData);
      } else if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
      }
      toast.success(isCreating ? 'Curso creado correctamente' : 'Curso actualizado');
      
      setIsCreating(false);
      setEditingId(null);
      setFormData({ name: '', description: '', isActive: true, allowedRoles: [] });

    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Error al guardar el curso');
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync(itemToDelete);
      toast.success('Curso eliminado correctamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar el curso');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', description: '', isActive: true, allowedRoles: [] });
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      allowedRoles: prev.allowedRoles.includes(role)
        ? prev.allowedRoles.filter(r => r !== role)
        : [...prev.allowedRoles, role]
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Eliminar Curso"
        message="¿Estás seguro de eliminar este curso? Se eliminarán todos sus videos y temas asociados. Esta acción no se puede deshacer."
        confirmLabel="Eliminar Curso"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
        isLoading={deleteMutation.isPending}
      />
      
      <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Cursos</h2>
        {!isCreating && !editingId && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Curso</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="card bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isCreating ? 'Crear Nuevo Curso' : 'Editar Curso'}
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
                placeholder="Ej: Facturación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Descripción del curso..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles Permitidos <span className="text-gray-500 text-xs">(selecciona los roles que pueden ver este curso)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <label key={role.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowedRoles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{role.name}</span>
                  </label>
                ))}
              </div>
              {formData.allowedRoles.length === 0 ? (
                <p className="text-xs text-green-600 mt-2 flex items-start">
                  <span className="mr-1">✓</span>
                  <span>Sin roles seleccionados = <strong>TODOS los usuarios podrán ver este curso</strong> (ideal para contenido general como errores comunes y soluciones)</span>
                </p>
              ) : (
                <p className="text-xs text-blue-600 mt-2">
                  ℹ️ Solo usuarios con los roles seleccionados podrán ver este curso
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Curso activo
              </label>
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

      {/* Categories List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">No hay cursos creados</div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  )}
                  <p className="text-xs text-gray-500">{category.videoCount || 0} videos</p>
                </div>

                {editingId !== category.id && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    </>
  );
};

export default CategoryManager;
