import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password });
      setAuth(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden bg-[#F8F8FA]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex w-full max-w-[960px] flex-col px-4 md:px-6">
        {/* Logo Area */}
        <div className="flex justify-center pb-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-primary text-2xl font-extrabold tracking-tight leading-tight">Multicentro</h1>
              <span className="text-xs font-bold text-accent uppercase tracking-[0.2em]">LMS Internal</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="mx-auto w-full max-w-[440px] flex flex-col bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(49,44,104,0.1)] border border-[#f0f0f5] overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-10 pb-4 text-center">
            <h2 className="text-[#333333] text-2xl font-bold leading-tight mb-2">Bienvenido</h2>
            <p className="text-[#636085] text-base font-medium leading-normal">
              Ingresa tus credenciales para acceder al panel de entrenamiento.
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 pb-10 pt-2 flex flex-col gap-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* TextField: Username */}
              <label className="flex flex-col w-full">
                <p className="text-[#121118] text-sm font-semibold leading-normal pb-2 ml-1">Usuario</p>
                <div className="relative flex items-center">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#121118] focus:outline-0 focus:ring-0 border border-[#d7d6e1] bg-[#f9f9fb] focus:border-primary h-12 placeholder:text-[#9CA3AF] p-[15px] text-base font-normal leading-normal transition-colors"
                    placeholder="ej. j.perez"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </label>

              {/* TextField: Password */}
              <label className="flex flex-col w-full">
                <div className="flex justify-between items-center pb-2 ml-1">
                  <p className="text-[#121118] text-sm font-semibold leading-normal">Contraseña</p>
                </div>
                <div className="flex w-full flex-1 items-stretch rounded-lg group focus-within:ring-1 focus-within:ring-primary">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-[#121118] focus:outline-0 focus:ring-0 border border-[#d7d6e1] bg-[#f9f9fb] focus:border-primary border-r-0 h-12 placeholder:text-[#9CA3AF] p-[15px] text-base font-normal leading-normal transition-colors"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#636085] cursor-pointer hover:text-primary transition-colors flex border border-[#d7d6e1] bg-[#f9f9fb] items-center justify-center pr-[15px] pl-2 rounded-r-lg border-l-0 focus-within:border-primary group-focus-within:border-primary"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {/* Primary Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-accent hover:bg-[#a0252d] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-md shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
                </button>
              </div>

              {/* Footer Link */}
              <div className="flex justify-center pt-2">
                <a className="text-sm font-medium text-[#636085] hover:text-primary transition-colors flex items-center gap-1.5" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>
          </div>

          {/* System Status Bar */}
          <div className="bg-[#f4f4f6] py-3 px-8 flex justify-between items-center border-t border-[#e2e1e9]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sistema Operativo</span>
            </div>
            <span className="text-[10px] font-medium text-gray-400">v4.2.0</span>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 text-center px-4">
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Este sistema es para uso exclusivo de personal autorizado de Multicentro. 
            Cualquier acceso no autorizado será monitoreado y reportado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
