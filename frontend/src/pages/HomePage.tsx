import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { categoryService } from '../services/category.service';
import { Category } from '../types';

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(true);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header único */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <span className="text-sm font-semibold text-accent-600 uppercase tracking-wide">Sistema de Capacitación</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-lg text-gray-600">
            Continúa tu aprendizaje o explora nuevo contenido
          </p>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Categorías</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border-l-4 border-accent-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Videos Disponibles</p>
                <p className="text-3xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + (cat.videoCount || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Acceso</p>
                <p className="text-3xl font-bold text-gray-900">24/7</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categorías en grid asimétrico */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Explora por Categoría</h2>
          <p className="text-gray-600 mb-6">Selecciona un área para comenzar</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
              <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Sin categorías disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {categories.map((category, index) => {
                // Crear patrón asimétrico
                const isLarge = index % 5 === 0 || index % 5 === 3;
                const colSpan = isLarge ? 'col-span-8' : 'col-span-4';
                
                return (
                  <Link
                    key={category.id}
                    to={`/course/${category.id}`}
                    className={`${colSpan} group relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 min-h-[180px] flex flex-col justify-between`}
                  >
                    {/* Patrón de fondo */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                      }}></div>
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-xs font-bold">
                          {category.videoCount || 0} videos
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="text-primary-100 text-sm line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Hover effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link 
            to="/search"
            className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Buscar Contenido</h3>
                <p className="text-gray-600 text-sm">Encuentra videos por código o tema</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/library"
            className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-accent-500 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                <svg className="w-7 h-7 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Ver Biblioteca</h3>
                <p className="text-gray-600 text-sm">Explora todo el contenido disponible</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
