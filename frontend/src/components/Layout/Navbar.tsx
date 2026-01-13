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

        {user?.role === 'ADMIN' && (
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
            <p className="text-xs text-primary-300">{user?.role}</p>
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

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo profesional */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 block leading-none">Multicentro</span>
              <span className="text-xs text-gray-500 font-medium">Capacitación</span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/search"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/search')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </Link>

              <Link
                to="/library"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/library')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Library className="w-5 h-5" />
                <span>Biblioteca</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/admin')
                      ? 'bg-accent-50 text-accent-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
