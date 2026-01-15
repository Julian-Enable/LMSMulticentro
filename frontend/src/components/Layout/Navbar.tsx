import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Library, LogOut, User, Settings, Home, Video } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 h-14 bg-primary-600 z-50 flex items-center px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-accent-500 rounded flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Multicentro</span>
        </Link>
        <div className="ml-auto">
          <Link to="/login" className="px-4 py-2 bg-accent-500 text-white rounded font-medium hover:bg-accent-600">
            Iniciar Sesión
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary-700 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-primary-600">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-accent-500 rounded flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Multicentro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
            isActive('/') 
              ? 'bg-primary-600 text-white' 
              : 'text-primary-200 hover:bg-primary-600 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Inicio</span>
        </Link>

        <Link
          to="/search"
          className={`flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
            isActive('/search') 
              ? 'bg-primary-600 text-white' 
              : 'text-primary-200 hover:bg-primary-600 hover:text-white'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="font-medium">Buscar</span>
        </Link>

        <Link
          to="/library"
          className={`flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
            isActive('/library') 
              ? 'bg-primary-600 text-white' 
              : 'text-primary-200 hover:bg-primary-600 hover:text-white'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="font-medium">Biblioteca</span>
        </Link>

        {user?.role?.code === 'ADMIN' && (
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
              isActive('/admin') 
                ? 'bg-accent-500 text-white' 
                : 'text-primary-200 hover:bg-accent-500/20 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Administrar</span>
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-primary-600 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-primary-300">{user?.role?.name || 'Sin rol'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-500 rounded text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
