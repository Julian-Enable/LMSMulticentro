import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Library, PlayCircle, Zap, Target, TrendingUp, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Hero Section - Diseño Moderno */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-5 h-5 text-accent-300" />
              <span className="text-sm font-semibold tracking-wide">Sistema de Capacitación Multicentro</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Aprende <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">Más Rápido</span>
              <br />
              Trabaja <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">Mejor</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Domina nuestro sistema ERP con videos interactivos, búsqueda inteligente y contenido estructurado
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/search" 
                className="group relative px-8 py-4 bg-white text-primary-600 rounded-2xl font-bold text-lg shadow-strong hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <SearchIcon className="w-6 h-6" />
                <span>Buscar Ahora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-accent-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <Link 
                to="/library" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
              >
                <Library className="w-6 h-6" />
                <span>Explorar Biblioteca</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-black text-accent-300 mb-1">{categories.length}</div>
                <div className="text-sm text-primary-200">Categorías</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-black text-accent-300 mb-1">∞</div>
                <div className="text-sm text-primary-200">Temas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-black text-accent-300 mb-1">24/7</div>
                <div className="text-sm text-primary-200">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Cards Modernas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas diseñadas para acelerar tu aprendizaje y productividad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-strong hover:shadow-2xl transition-all duration-300 border-2 border-primary-100">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-3">Búsqueda Instantánea</h3>
                <p className="text-gray-600 leading-relaxed">
                  Encuentra soluciones en segundos con nuestra búsqueda por código, título o tags de error
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-strong hover:shadow-2xl transition-all duration-300 border-2 border-accent-100">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-3">Timestamps Precisos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Salta directamente al contenido exacto que necesitas, sin perder tiempo
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-3xl transform rotate-2 group-hover:rotate-4 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-strong hover:shadow-2xl transition-all duration-300 border-2 border-primary-100">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-3">Modo Curso</h3>
                <p className="text-gray-600 leading-relaxed">
                  Capacitación estructurada paso a paso para dominar todo el sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Diseño Premium */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-2">
                Categorías de Capacitación
              </h2>
              <p className="text-xl text-gray-600">Elige tu área de aprendizaje</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-8 border-transparent border-r-accent-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-xl text-gray-600 font-semibold">Cargando categorías...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300">
              <Library className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-2xl font-semibold text-gray-600">No hay categorías disponibles</p>
              <p className="text-gray-500 mt-2">Contacta al administrador para agregar contenido</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/course/${category.id}`}
                  className="group relative hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border-2 border-gray-100 group-hover:border-primary-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                        {category.videoCount || 0} videos
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-accent-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Explorar</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Llamado a la acción moderno */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Únete a tu equipo y domina el sistema ERP con nuestra plataforma de capacitación
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/search" 
                className="px-10 py-5 bg-white text-primary-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <SearchIcon className="w-6 h-6" />
                <span>Comenzar Ahora</span>
              </Link>
              
              <Link 
                to="/library" 
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Library className="w-6 h-6" />
                <span>Ver Contenido</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <BookOpen className="w-20 h-20 text-primary-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Sistema de Capacitación
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Aprende, consulta y domina el sistema ERP de manera rápida y efectiva
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/search" className="btn btn-primary flex items-center justify-center space-x-2">
            <SearchIcon className="w-5 h-5" />
            <span>Buscar Información</span>
          </Link>
          <Link to="/library" className="btn btn-secondary flex items-center justify-center space-x-2">
            <Library className="w-5 h-5" />
            <span>Explorar Biblioteca</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <SearchIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Búsqueda Inteligente</h3>
          <p className="text-gray-600">
            Encuentra información específica por código, título o tags de error
          </p>
        </div>

        <div className="card text-center">
          <PlayCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Timestamps Precisos</h3>
          <p className="text-gray-600">
            Salta directamente al minuto exacto del tema que necesitas
          </p>
        </div>

        <div className="card text-center">
          <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Modo Curso</h3>
          <p className="text-gray-600">
            Capacitación secuencial completa para nuevos empleados
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Categorías de Capacitación</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Cargando categorías...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No hay categorías disponibles</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/course/${category.id}`}
                className="card hover:shadow-lg transition-shadow duration-200 border-2 border-transparent hover:border-primary-500"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 mb-4">{category.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <PlayCircle className="w-4 h-4 mr-1" />
                  <span>{category.videoCount || 0} videos</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Start Guide */}
      <section className="bg-primary-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Guía Rápida</h2>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-sm font-bold mr-3 flex-shrink-0">
              1
            </span>
            <p>
              <strong>¿Encontraste un error?</strong> Usa la búsqueda para encontrar la solución
              rápidamente
            </p>
          </div>
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-sm font-bold mr-3 flex-shrink-0">
              2
            </span>
            <p>
              <strong>¿Eres nuevo?</strong> Explora las categorías en modo curso para una
              capacitación completa
            </p>
          </div>
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-sm font-bold mr-3 flex-shrink-0">
              3
            </span>
            <p>
              <strong>¿Necesitas repasar?</strong> Usa la biblioteca para acceso directo a temas
              específicos
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
