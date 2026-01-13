import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen, Library, LogOut, User, Settings, GraduationCap } from 'lucide-react';
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

  return (
    <nav className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 shadow-strong sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo con diseño moderno */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-primary-600" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight block">Multicentro</span>
              <span className="text-xs text-primary-100 font-medium tracking-wider uppercase">Learning Hub</span>
            </div>
          </Link>

          {/* Navigation Links con estilo moderno */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/search"
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/search')
                    ? 'bg-white text-primary-600 shadow-lg scale-105'
                    : 'text-white hover:bg-white/20 hover:shadow-md'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </Link>

              <Link
                to="/library"
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/library')
                    ? 'bg-white text-primary-600 shadow-lg scale-105'
                    : 'text-white hover:bg-white/20 hover:shadow-md'
                }`}
              >
                <Library className="w-5 h-5" />
                <span>Biblioteca</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/admin')
                      ? 'bg-accent-500 text-white shadow-lg scale-105'
                      : 'text-white hover:bg-accent-500/30 hover:shadow-md'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          )}

          {/* User Menu con diseño premium */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-accent shadow-xl hover:shadow-2xl">
              <User className="w-5 h-5 mr-2" />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
