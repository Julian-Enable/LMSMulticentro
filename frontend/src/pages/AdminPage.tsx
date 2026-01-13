import { useState } from 'react';
import CategoryManager from '../components/Admin/CategoryManager';
import VideoManager from '../components/Admin/VideoManager';
import TopicManager from '../components/Admin/TopicManager';
import TagManager from '../components/Admin/TagManager';
import QuizManager from '../components/Admin/QuizManager';

type TabType = 'categories' | 'videos' | 'topics' | 'tags' | 'quizzes';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

  const tabs = [
    { id: 'categories' as TabType, label: 'Categorías' },
    { id: 'videos' as TabType, label: 'Videos' },
    // Hide these tabs in mock mode for now (not fully implemented)
    ...(!isMockMode ? [
      { id: 'topics' as TabType, label: 'Temas' },
      { id: 'tags' as TabType, label: 'Etiquetas' },
      { id: 'quizzes' as TabType, label: 'Cuestionarios' },
    ] : []),
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f9f9fb]">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-7xl p-6 lg:p-10 flex flex-col gap-8">
          {/* Page Header & Tabs */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Contenido</h1>
              <p className="text-slate-500">Administra los videos, categorías y materiales de entrenamiento de la plataforma.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                        isActive
                          ? 'font-bold text-primary border-primary'
                          : 'font-medium text-slate-500 hover:text-primary border-transparent hover:border-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'videos' && <VideoManager />}
            {activeTab === 'topics' && <TopicManager />}
            {activeTab === 'tags' && <TagManager />}
            {activeTab === 'quizzes' && <QuizManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
