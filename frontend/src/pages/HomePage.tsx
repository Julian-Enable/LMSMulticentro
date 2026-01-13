import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search as SearchIcon, Library, PlayCircle } from 'lucide-react';
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
