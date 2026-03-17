import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Library, LogOut, User, Settings, Home, Video, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Navbar = ({ isOpen = false, onClose }: NavbarProps) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    onClose?.();
  };

  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 h-14 bg-primary-600 dark:bg-slate-900 z-50 flex items-center px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-accent-500 rounded flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Multicentro</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/login" className="px-4 py-2 bg-accent-500 text-white rounded font-medium hover:bg-accent-600">
            Iniciar Sesión
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-primary-700 dark:bg-slate-800 text-white flex flex-col z-40 transition-all duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-primary-600 dark:border-slate-700">
        <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
          <div className="w-7 h-7 bg-accent-500 rounded flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Multicentro</span>
        </Link>
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded text-primary-200 hover:text-white hover:bg-primary-600 transition-colors"
          aria-label="Cerrar menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link
          to="/"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all border-l-2 ${
            isActive('/') 
              ? 'bg-primary-600 text-white border-accent-500' 
              : 'text-primary-200 hover:bg-primary-600/60 hover:text-white border-transparent'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Inicio</span>
        </Link>

        <Link
          to="/search"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all border-l-2 ${
            isActive('/search') 
              ? 'bg-primary-600 text-white border-accent-500' 
              : 'text-primary-200 hover:bg-primary-600/60 hover:text-white border-transparent'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="font-medium">Buscar</span>
        </Link>

        <Link
          to="/library"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all border-l-2 ${
            isActive('/library') 
              ? 'bg-primary-600 text-white border-accent-500' 
              : 'text-primary-200 hover:bg-primary-600/60 hover:text-white border-transparent'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="font-medium">Biblioteca</span>
        </Link>

        {user?.role?.code === 'ADMIN' && (
          <Link
            to="/admin"
            onClick={handleNavClick}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all border-l-2 ${
              isActive('/admin') 
                ? 'bg-accent-600 text-white border-accent-400' 
                : 'text-primary-200 hover:bg-accent-500/20 hover:text-white border-transparent'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Administrar</span>
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-primary-600 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            to="/profile"
            onClick={handleNavClick}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors flex-1 ${
              isActive('/profile') ? 'bg-primary-600 dark:bg-slate-700' : 'hover:bg-primary-600/50 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username}</p>
              <p className="text-xs text-primary-300 dark:text-slate-400">{user?.role?.name || 'Sin rol'}</p>
            </div>
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
            aria-label="Cambiar tema"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-500 dark:bg-slate-700 dark:hover:bg-slate-600 rounded text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );

};

export default Navbar;
