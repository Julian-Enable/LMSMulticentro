import React, { useState, useEffect } from 'react';
import { 
  Wand2, Save, Trash2, Plus, GripVertical, AlertCircle, 
  Youtube, Loader2, CheckCircle2, Tag as TagIcon, Clock
} from 'lucide-react';
import { categoryService } from '../../services/category.service';
import { videoService } from '../../services/video.service';
import { youtubeService } from '../../services/youtube.service';
import { Category } from '../../types';

interface TopicDraft {
  id: string; // temporary id for react keys
  code: string;
  title: string;
  description: string;
  timestamp: string; // Will be converted to number on save
  duration: string;
  tagsString: string; // Comma separated for easy editing
}

export default function UnifiedCreator() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [categoryId, setCategoryId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  
  const [topics, setTopics] = useState<TopicDraft[]>([]);
  const [expandedTopicIndex, setExpandedTopicIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      setErrorMsg('Error al cargar las categorías (Cursos).');
    }
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleMagicExtract = async () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      setErrorMsg('Por favor ingresa una URL de YouTube válida.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const info = await youtubeService.getVideoInfo(videoId);
      setVideoTitle(info.title);
      setVideoDescription(info.description);
      setVideoThumbnailUrl(info.thumbnailUrl);
      setVideoDuration(info.duration);

      // Attempt to extract topic codes from the video title.
      // E.g., title "1,21 - 1,22 - CERRAR CAJA" -> extracts ['1,21', '1,22']
      const codeMatches = info.title.match(/\d+[,.]\d+/g) || [];

      if (info.chapters && info.chapters.length > 0) {
        const generatedTopics: TopicDraft[] = info.chapters.map((chapter, index) => {
          // Calculate duration if possible
          let durationStr = '';
          if (index < info.chapters.length - 1) {
            durationStr = String(info.chapters[index + 1].timestamp - chapter.timestamp);
          } else {
             durationStr = String(info.duration - chapter.timestamp);
          }

          // Use extracted code if available, otherwise default to sequential
          let extractedCodeStr = codeMatches[index] ? codeMatches[index].replace(',', '.') : `${index + 1}.0`;

          return {
            id: window.crypto.randomUUID(),
            code: extractedCodeStr,
            title: chapter.title,
            description: '',
            timestamp: String(chapter.timestamp),
            duration: durationStr,
            tagsString: chapter.tags ? chapter.tags.join(', ') : ''
          };
        });
        setTopics(generatedTopics);
        setSuccessMsg(`¡Magia completada! Se extrajeron ${generatedTopics.length} temas del video.`);
      } else {
        setTopics([]);
        setSuccessMsg('Se extrajo la información del video, pero no se encontraron "Chapters" en la descripción para general los temas.');
      }
    } catch (err) {
      console.error('Error fetching YouTube info:', err);
      setErrorMsg('Error al extraer datos de YouTube. Asegúrate que la URL sea pública y válida.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmptyTopic = () => {
    setTopics([...topics, {
      id: window.crypto.randomUUID(),
      code: `${topics.length + 1}.0`,
      title: 'Nuevo Tema',
      description: '',
      timestamp: '0',
      duration: '',
      tagsString: ''
    }]);
  };

  const handleUpdateTopic = (index: number, field: keyof TopicDraft, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    setTopics(newTopics);
  };

  const handleDeleteTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setErrorMsg('Debes seleccionar un Curso (Categoría).');
      return;
    }
    if (!videoTitle) {
      setErrorMsg('El video debe tener un título.');
      return;
    }

    const externalId = extractYouTubeId(youtubeUrl);
    if (!externalId) {
      setErrorMsg('URL de YouTube inválida no se puede guardar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Format payload wrapper
      const payload = {
        title: videoTitle,
        description: videoDescription,
        externalId: externalId,
        platform: 'YOUTUBE',
        duration: videoDuration,
        thumbnailUrl: videoThumbnailUrl,
        categoryId: categoryId,
        topics: topics.map(t => ({
          code: t.code,
          title: t.title,
          description: t.description,
          timestamp: parseInt(t.timestamp) || 0,
          duration: parseInt(t.duration) || null,
          tags: t.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        }))
      };

      await videoService.createBundle(payload);
      setSuccessMsg('¡Curso guardado exitosamente en la base de datos!');
      
      // Cleanup to allow next entry
      setYoutubeUrl('');
      setVideoTitle('');
      setVideoDescription('');
      setTopics([]);
      
    } catch (err: any) {
      console.error('Error saving bundle:', err);
      setErrorMsg(err.response?.data?.message || 'Error al guardar el paquete de contenido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Creador Mágico de Cursos</h2>
            <p className="text-blue-100 text-sm mt-1">Extrae videos de YouTube y segmenta automáticamente tus clases.</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 text-green-700 dark:text-green-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Source */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b dark:border-slate-600 pb-2">1. Fuente del Contenido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pertenece al Curso (Categoría)</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 dark:text-slate-100"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Curso --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL del Video de YouTube</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Youtube className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 dark:text-slate-100"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleMagicExtract}
                    disabled={loading || !youtubeUrl}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    Extraer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Video Metadata */}
          {videoTitle && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b dark:border-slate-600 pb-2">2. Información del Video</h3>
              <div className="flex flex-col md:flex-row gap-6 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                {videoThumbnailUrl && (
                  <div className="w-full md:w-64 flex-shrink-0">
                    <img src={videoThumbnailUrl} alt="Thumbnail" className="w-full h-auto rounded-lg shadow-sm" />
                    {videoDuration && (
                       <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-center bg-slate-200 dark:bg-slate-600 py-1 rounded">
                         <Clock className="w-3 h-3" /> Duración total: {videoDuration}s
                       </div>
                    )}
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 pl-1">Título del Video</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 dark:text-slate-100"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 pl-1">Descripción</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white dark:bg-slate-700 dark:text-slate-100"
                      rows={3}
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Topics & Tags */}
          {videoTitle && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="flex items-center justify-between border-b dark:border-slate-600 pb-2">
                 <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">3. Temas (Topics) y Etiquetas Generadas</h3>
                 <button 
                  type="button" 
                  onClick={handleAddEmptyTopic}
                  className="text-sm flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300"
                 >
                   <Plus className="w-4 h-4" /> Añadir Tema Manualmente
                 </button>
               </div>

               {topics.length === 0 ? (
                 <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
                    No hay temas generados. Añade uno manualmente para segmentar el video.
                 </div>
               ) : (
                 <div className="space-y-3">
                   {topics.map((topic, index) => {
                     const isExpanded = expandedTopicIndex === index;
                     return (
                     <div key={topic.id} className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-600 shadow-sm hover:border-primary/30'}`}>
                        {/* Header (Summary) */}
                        <div
                          className="flex items-center gap-3 p-3 cursor-pointer select-none"
                          onClick={() => setExpandedTopicIndex(isExpanded ? null : index)}
                        >
                          <div className="cursor-grab text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" onClick={(e) => e.stopPropagation()}>
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="w-12 text-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded py-1">{topic.code}</div>
                          <div className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{topic.title || 'Tema sin título'}</div>
                          {topic.duration && <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded">{topic.duration}s</div>}
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteTopic(index); }} className="p-1.5 text-slate-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Body (Expanded Form) */}
                        {isExpanded && (
                          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                              <div className="md:col-span-2">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Código</label>
                                <input type="text" value={topic.code} onChange={(e) => handleUpdateTopic(index, 'code', e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none py-1.5 bg-white dark:bg-slate-700 dark:text-slate-100 px-2 rounded-md shadow-sm" />
                              </div>

                              <div className="md:col-span-10">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Título del Tema</label>
                                <input type="text" value={topic.title} onChange={(e) => handleUpdateTopic(index, 'title', e.target.value)} className="w-full text-sm font-medium border border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none py-1.5 bg-white dark:bg-slate-700 dark:text-slate-100 px-2 rounded-md shadow-sm" placeholder="Ej: Introducción a React" />
                              </div>

                              <div className="md:col-span-4 flex gap-2">
                                <div className="w-1/2">
                                  <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inicio (s)</label>
                                  <input type="text" value={topic.timestamp} onChange={(e) => handleUpdateTopic(index, 'timestamp', e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none py-1.5 font-mono text-center rounded-md bg-white dark:bg-slate-700 dark:text-slate-100 shadow-sm" />
                                </div>
                                <div className="w-1/2">
                                   <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dura (s)</label>
                                   <input type="text" placeholder="auto" value={topic.duration} onChange={(e) => handleUpdateTopic(index, 'duration', e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none py-1.5 font-mono text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 shadow-sm" />
                                </div>
                              </div>

                              <div className="md:col-span-8">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><TagIcon className="w-3 h-3"/> Etiquetas (sep. x coma)</label>
                                <input type="text" value={topic.tagsString} onChange={(e) => handleUpdateTopic(index, 'tagsString', e.target.value)} className="w-full text-sm border border-primary/20 dark:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none py-1.5 text-primary-700 dark:text-primary-400 bg-primary/5 dark:bg-primary-900/20 px-3 rounded-md shadow-sm" placeholder="ej: front, web, react" />
                              </div>
                            </div>
                          </div>
                        )}
                     </div>
                     );
                   })}
                 </div>
               )}
             </div>
          )}

          {/* Actions */}
          {videoTitle && (
            <div className="pt-6 border-t dark:border-slate-600 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/30"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Guardar Curso Completo
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
