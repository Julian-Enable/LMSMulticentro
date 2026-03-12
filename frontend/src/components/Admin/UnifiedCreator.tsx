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

      if (info.chapters && info.chapters.length > 0) {
        const generatedTopics: TopicDraft[] = info.chapters.map((chapter, index) => {
          // Calculate duration if possible
          let durationStr = '';
          if (index < info.chapters.length - 1) {
            durationStr = String(info.chapters[index + 1].timestamp - chapter.timestamp);
          } else {
             durationStr = String(info.duration - chapter.timestamp);
          }

          return {
            id: window.crypto.randomUUID(),
            code: `${index + 1}.0`,
            title: chapter.title,
            description: '',
            timestamp: String(chapter.timestamp),
            duration: durationStr,
            tagsString: 'generado'
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Source */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">1. Fuente del Contenido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Pertenece al Curso (Categoría)</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                <label className="text-sm font-medium text-slate-700">URL del Video de YouTube</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Youtube className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleMagicExtract}
                    disabled={loading || !youtubeUrl}
                    className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
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
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">2. Información del Video</h3>
              <div className="flex flex-col md:flex-row gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {videoThumbnailUrl && (
                  <div className="w-full md:w-64 flex-shrink-0">
                    <img src={videoThumbnailUrl} alt="Thumbnail" className="w-full h-auto rounded-lg shadow-sm" />
                    {videoDuration && (
                       <div className="mt-2 text-xs font-medium text-slate-500 flex items-center gap-1 justify-center bg-slate-200 py-1 rounded">
                         <Clock className="w-3 h-3" /> Duración total: {videoDuration}s
                       </div>
                    )}
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 pl-1">Título del Video</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 pl-1">Descripción</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
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
               <div className="flex items-center justify-between border-b pb-2">
                 <h3 className="text-lg font-semibold text-slate-800">3. Temas (Topics) y Etiquetas Generadas</h3>
                 <button 
                  type="button" 
                  onClick={handleAddEmptyTopic}
                  className="text-sm flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
                 >
                   <Plus className="w-4 h-4" /> Añadir Tema Manualmente
                 </button>
               </div>

               {topics.length === 0 ? (
                 <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    No hay temas generados. Añade uno manualmente para segmentar el video.
                 </div>
               ) : (
                 <div className="space-y-3">
                   {topics.map((topic, index) => (
                     <div key={topic.id} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary/40 transition-colors group">
                        <div className="pt-2 cursor-grab text-slate-400 group-hover:text-slate-600">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                          <div className="md:col-span-2">
                            <label className="text-xs text-slate-500 font-medium">Código</label>
                            <input type="text" value={topic.code} onChange={(e) => handleUpdateTopic(index, 'code', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none py-1 bg-slate-50 px-2 rounded" />
                          </div>
                          
                          <div className="md:col-span-4">
                            <label className="text-xs text-slate-500 font-medium">Título del Tema</label>
                            <input type="text" value={topic.title} onChange={(e) => handleUpdateTopic(index, 'title', e.target.value)} className="w-full text-sm font-medium border-b border-transparent focus:border-primary hover:border-slate-300 focus:outline-none py-1 px-2" placeholder="Ej: Introducción a React" />
                          </div>

                          <div className="md:col-span-2 flex gap-2">
                            <div className="w-1/2">
                              <label className="text-xs text-slate-500 font-medium">Inicio (s)</label>
                              <input type="text" value={topic.timestamp} onChange={(e) => handleUpdateTopic(index, 'timestamp', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none py-1 font-mono text-center" />
                            </div>
                            <div className="w-1/2">
                               <label className="text-xs text-slate-500 font-medium">Dura (s)</label>
                               <input type="text" placeholder="auto" value={topic.duration} onChange={(e) => handleUpdateTopic(index, 'duration', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none py-1 font-mono text-center text-slate-500" />
                            </div>
                          </div>

                          <div className="md:col-span-4">
                            <label className="text-xs text-slate-500 font-medium flex items-center gap-1"><TagIcon className="w-3 h-3"/> Etiquetas (sep. x coma)</label>
                            <input type="text" value={topic.tagsString} onChange={(e) => handleUpdateTopic(index, 'tagsString', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none py-1 text-primary-700 bg-primary-50 px-2 rounded" placeholder="ej: front, web, react" />
                          </div>
                        </div>

                        <button type="button" onClick={() => handleDeleteTopic(index)} className="pt-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {/* Actions */}
          {videoTitle && (
            <div className="pt-6 border-t flex justify-end">
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
