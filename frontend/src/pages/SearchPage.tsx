import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, Tag, Video } from 'lucide-react';
import { searchService } from '../services/search.service';
import { categoryService } from '../services/category.service';
import { Topic, Category } from '../types';
import { formatTimestamp } from '../utils/helpers';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      performSearch(q, searchParams.get('category') || '');
    }
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(true);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params: any = { q: query };
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      setSearchParams(params);
    }
  };

  const performSearch = async (searchQuery: string, categoryId: string) => {
    setLoading(true);
    try {
      const data = await searchService.search(searchQuery, categoryId || undefined, pagination.page);
      setResults(data.results);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda Inteligente</h1>
        <p className="text-gray-600">
          Busca por código de tema, título, descripción o tags de error
        </p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: error 404, crear factura, 1.11..."
                  className="input pl-10"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-48"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Buscando...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} encontrado
              {pagination.total !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {results.map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className="card hover:shadow-lg transition-shadow duration-200 border-2 border-transparent hover:border-primary-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded">
                        {topic.code}
                      </span>
                      {topic.relevance && topic.relevance > 0 && (
                        <span className="text-xs text-gray-500">
                          Relevancia: {topic.relevance}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>

                    {topic.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{topic.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-1" />
                        <span>{topic.video?.title}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTimestamp(topic.timestamp)}</span>
                      </div>

                      {topic.video?.category && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {topic.video.category.name}
                        </span>
                      )}
                    </div>

                    {topic.tags && topic.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        {topic.tags.map((topicTag) => (
                          <span
                            key={topicTag.tag.id}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {topicTag.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    const params: any = { q: query, page: page.toString() };
                    if (selectedCategory) {
                      params.category = selectedCategory;
                    }
                    setSearchParams(params);
                  }}
                  className={`px-4 py-2 rounded ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : query && !loading ? (
        <div className="card text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda o una categoría diferente
          </p>
        </div>
      ) : (
        <div className="card text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Realiza una búsqueda</h3>
          <p className="text-gray-600">
            Ingresa un término de búsqueda para encontrar temas relacionados
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
