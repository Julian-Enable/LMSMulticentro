import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { progressService, ProgressRecord } from '../services/progress.service';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  // Progress state
  const [recentProgress, setRecentProgress] = useState<ProgressRecord[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await progressService.getAllProgress();
      setRecentProgress(data.slice(0, 10));
    } catch {
      // fail silently
    } finally {
      setProgressLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('La contraseña nueva debe tener al menos 6 caracteres');
      return;
    }

    setPwLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPwError(error?.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Mi Perfil</h1>
          <p className="text-slate-500 mt-1">Administra tu cuenta y revisa tu progreso</p>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-gray-900 truncate">{user?.username}</p>
            <p className="text-slate-500 text-sm truncate">{user?.email || 'Sin correo registrado'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: user?.role?.color ? `${user.role.color}20` : '#e0e7ff', color: user?.role?.color || '#3730a3' }}>
              {user?.role?.name || 'Sin rol'}
            </span>
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Últimas lecciones completadas</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {progressLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : recentProgress.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                Aún no has completado ninguna lección.{' '}
                <Link to="/library" className="text-primary-600 font-semibold hover:underline">
                  Explorar cursos
                </Link>
              </div>
            ) : (
              recentProgress.map((record) => (
                <div key={record.topicId} className="flex items-center gap-3 px-6 py-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {record.topic?.code} — {record.topic?.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {record.topic?.video?.category?.name}
                      {record.completedAt && (
                        <> · {new Date(record.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</>
                      )}
                    </p>
                  </div>
                  {record.topicId && (
                    <Link
                      to={`/topic/${record.topicId}`}
                      className="text-xs text-primary-600 font-semibold hover:underline flex-shrink-0"
                    >
                      Ver
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Cambiar Contraseña</h2>
          </div>
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            {pwError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                ¡Contraseña actualizada exitosamente!
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100">
            <h2 className="text-lg font-bold text-red-800">Sesión</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Cerrar sesión en este dispositivo. Tu progreso estará guardado en el servidor.
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 rounded-lg font-semibold text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
