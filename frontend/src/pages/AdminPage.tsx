import { useState } from 'react';
import { Folder, Video, FileText, Tag, HelpCircle } from 'lucide-react';
import CategoryManager from '../components/Admin/CategoryManager';
import VideoManager from '../components/Admin/VideoManager';
import TopicManager from '../components/Admin/TopicManager';
import TagManager from '../components/Admin/TagManager';
import QuizManager from '../components/Admin/QuizManager';

type TabType = 'categories' | 'videos' | 'topics' | 'tags' | 'quizzes';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('categories');

  const tabs = [
    { id: 'categories' as TabType, label: 'Categorías', icon: Folder },
    { id: 'videos' as TabType, label: 'Videos', icon: Video },
    { id: 'topics' as TabType, label: 'Temas', icon: FileText },
    { id: 'tags' as TabType, label: 'Tags', icon: Tag },
    { id: 'quizzes' as TabType, label: 'Quizzes', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona todo el contenido del sistema de capacitación</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap
                    transition-colors
                    ${
                      isActive
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
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
  );
};

export default AdminPage;
