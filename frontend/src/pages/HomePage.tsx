import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Library, PlayCircle, Zap, Clock, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Profesional */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sistema de Capacitación<br />
              <span className="text-primary-200">Multicentro</span>
            </h1>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Accede a contenido de capacitación organizado, búsqueda inteligente y aprende a tu propio ritmo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/search" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Buscar Contenido
              </Link>
              
              <Link 
                to="/library" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-400 transition-colors border-2 border-primary-400"
              >
                <Library className="w-5 h-5 mr-2" />
                Explorar Biblioteca
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Búsqueda Inteligente</h3>
              <p className="text-gray-600 text-sm">
                Encuentra información rápidamente por código, título o tags
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timestamps Precisos</h3>
              <p className="text-gray-600 text-sm">
                Salta directamente al momento exacto del video que necesitas
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Modo Curso</h3>
              <p className="text-gray-600 text-sm">
                Capacitación estructurada paso a paso para nuevos empleados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Categorías de Capacitación
              </h2>
              <p className="text-gray-600">Selecciona una categoría para comenzar tu aprendizaje</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Cargando categorías...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-gray-100 rounded-2xl p-12 text-center">
                <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
                <p className="text-gray-600">Contacta al administrador para agregar contenido</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/course/${category.id}`}
                    className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {category.videoCount || 0} videos
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="mt-4 flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      <span>Ver contenido</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
            <p className="text-primary-100 text-lg mb-8">
              Accede a todo el contenido de capacitación y mejora tus habilidades hoy mismo
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
