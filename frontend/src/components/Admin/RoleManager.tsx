import { useState, useEffect } from 'react';
import { Save, X, Plus, Edit2, Trash2 } from 'lucide-react';
import { Role, roleService } from '../../services/role.service';

const RoleManager = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getAll();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
      alert('Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      code: '',
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
    });
  };

  const handleEdit = (role: Role) => {
    if (role.isSystem) {
      alert('Los roles del sistema no se pueden editar completamente');
    }
    setEditingId(role.id);
    setFormData({
      code: role.code,
      name: role.name,
      description: role.description || '',
      color: role.color,
      isActive: role.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.code || !formData.name) {
        alert('Código y nombre son requeridos');
        return;
      }

      if (isCreating) {
        await roleService.create(formData);
      } else if (editingId) {
        await roleService.update(editingId, formData);
      }

      setIsCreating(false);
      setEditingId(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        color: '#3B82F6',
        isActive: true,
      });
      await loadRoles();
    } catch (error: any) {
      console.error('Error saving role:', error);
      const message = error.response?.data?.message || 'Error al guardar el rol';
      alert(message);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
    });
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) {
      alert('Los roles del sistema no se pueden eliminar');
      return;
    }

    if (role._count && role._count.users > 0) {
      alert(`No se puede eliminar el rol "${role.name}" porque tiene ${role._count.users} usuario(s) asignado(s). Reasigna los usuarios primero.`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) {
      return;
    }

    try {
      await roleService.delete(role.id);
      await loadRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      const message = error.response?.data?.message || 'Error al eliminar el rol';
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
          <p className="text-sm text-gray-500 mt-1">Crea y administra los roles del sistema</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo Rol
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">
            {isCreating ? 'Crear Nuevo Rol' : 'Editar Rol'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(ej: CONTADOR, sin espacios, mayúsculas)</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s/g, '_') })}
                className="input"
                placeholder="CONTADOR"
                disabled={editingId !== null && roles.find(r => r.id === editingId)?.isSystem}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Contador"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={2}
                placeholder="Descripción del rol..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color <span className="text-gray-500 text-xs">(para badges)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="input flex-1"
                  placeholder="#3B82F6"
                />
              </div>
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
                Rol activo
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!formData.code || !formData.name}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-bold transition-all"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Roles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary/5 to-purple-50 border-b-2 border-primary/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-primary uppercase">Código</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-primary uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-primary uppercase">Descripción</th>
                <th className="px-6 py-4 text-center text-xs font-extrabold text-primary uppercase">Color</th>
                <th className="px-6 py-4 text-center text-xs font-extrabold text-primary uppercase">Usuarios</th>
                <th className="px-6 py-4 text-center text-xs font-extrabold text-primary uppercase">Estado</th>
                <th className="px-6 py-4 text-center text-xs font-extrabold text-primary uppercase w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No hay roles disponibles
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{role.code}</code>
                        {role.isSystem && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                            Sistema
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{role.description || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-8 h-8 rounded border-2 shadow-sm"
                          style={{ backgroundColor: role.color, borderColor: role.color }}
                        ></div>
                        <span className="text-xs text-gray-500 font-mono">{role.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-gray-700">{role._count?.users || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          role.isActive
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        {role.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(role)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(role)}
                          disabled={role.isSystem}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={role.isSystem ? 'Rol del sistema no se puede eliminar' : 'Eliminar'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManager;
