import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Folder, Video, FileText, Search } from 'lucide-react';
import { categoryService } from '../services/category.service';
import { Category, Video as VideoType, Topic } from '../types';
import { formatTimestamp } from '../utils/helpers';

const LibraryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll(true);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleVideo = (videoId: string) => {
    const newExpanded = new Set(expandedVideos);
    if (newExpanded.has(videoId)) {
      newExpanded.delete(videoId);
    } else {
      newExpanded.add(videoId);
    }
    setExpandedVideos(newExpanded);
  };

  const expandAll = () => {
    const allCategories = new Set(categories.map((c) => c.id));
    const allVideos = new Set(
      categories.flatMap((c) => (c.videos || []).map((v: VideoType) => v.id))
    );
    setExpandedCategories(allCategories);
    setExpandedVideos(allVideos);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedVideos(new Set());
  };

  const filterTopics = (topics: Topic[] | undefined): Topic[] => {
    if (!topics) return [];
    if (!searchQuery) return topics;

    const query = searchQuery.toLowerCase();
    return topics.filter(
      (topic) =>
        topic.code.toLowerCase().includes(query) ||
        topic.title.toLowerCase().includes(query) ||
        topic.description?.toLowerCase().includes(query) ||
        topic.tags?.some((t) => t.tag.name.toLowerCase().includes(query))
    );
  };

  const filterVideos = (videos: VideoType[] | undefined): VideoType[] => {
    if (!videos) return [];
    
    return videos
      .map((video) => ({
        ...video,
        topics: filterTopics(video.topics),
      }))
      .filter(
        (video) =>
          !searchQuery ||
          (video.topics && video.topics.length > 0) ||
          video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const filterCategories = (): Category[] => {
    return categories
      .map((category) => ({
        ...category,
        videos: filterVideos(category.videos),
      }))
      .filter(
        (category) =>
          !searchQuery ||
          (category.videos && category.videos.length > 0) ||
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const filteredCategories = filterCategories();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Cargando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Conocimiento</h1>
        <p className="text-gray-600">Accede directamente a cualquier tema de capacitación</p>
      </div>

      {/* Search and Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en la biblioteca..."
              className="input pl-10"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={expandAll} className="btn btn-secondary text-sm">
              Expandir todo
            </button>
            <button onClick={collapseAll} className="btn btn-secondary text-sm">
              Colapsar todo
            </button>
          </div>
        </div>
      </div>

      {/* Tree View */}
      <div className="space-y-2">
        {filteredCategories.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron resultados' : 'No hay contenido disponible'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Intenta con otros términos de búsqueda'
                : 'Aún no se ha agregado contenido a la biblioteca'}
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isCategoryExpanded = expandedCategories.has(category.id);

            return (
              <div key={category.id} className="card">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center space-x-2 text-left group"
                >
                  {isCategoryExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <Folder className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-primary-600">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({category.videos?.length || 0} videos)
                  </span>
                </button>

                {/* Videos */}
                {isCategoryExpanded && category.videos && (
                  <div className="ml-7 mt-2 space-y-2">
                    {category.videos.map((video: VideoType) => {
                      const isVideoExpanded = expandedVideos.has(video.id);
                      const videoTopics = filterTopics(video.topics);

                      return (
                        <div key={video.id} className="border-l-2 border-gray-200 pl-4">
                          {/* Video Header */}
                          <button
                            onClick={() => toggleVideo(video.id)}
                            className="w-full flex items-center space-x-2 text-left group py-1"
                          >
                            {isVideoExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                            <Video className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900 group-hover:text-primary-600">
                              {video.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({videoTopics.length} temas)
                            </span>
                          </button>

                          {/* Topics */}
                          {isVideoExpanded && videoTopics.length > 0 && (
                            <div className="ml-6 mt-1 space-y-1">
                              {videoTopics
                                .sort((a, b) => {
                                  const [aMajor, aMinor] = a.code.split('.').map(Number);
                                  const [bMajor, bMinor] = b.code.split('.').map(Number);
                                  if (aMajor !== bMajor) return aMajor - bMajor;
                                  return aMinor - bMinor;
                                })
                                .map((topic) => (
                                  <Link
                                    key={topic.id}
                                    to={`/topic/${topic.id}`}
                                    className="flex items-center space-x-2 py-1.5 px-2 rounded hover:bg-primary-50 group"
                                  >
                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                                    <span className="text-xs font-mono text-primary-700 font-semibold">
                                      {topic.code}
                                    </span>
                                    <span className="text-sm text-gray-700 group-hover:text-primary-600 flex-1">
                                      {topic.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatTimestamp(topic.timestamp)}
                                    </span>
                                  </Link>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
