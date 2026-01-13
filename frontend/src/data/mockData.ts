import { Category, Video, Topic, User } from '../types';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Ventas Corporativas',
    description: 'Técnicas avanzadas de ventas B2B y gestión de grandes cuentas',
    color: '#10b981',
    icon: 'trending_up',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Compliance y Seguridad',
    description: 'Protocolos de seguridad industrial y normativas empresariales',
    color: '#ef4444',
    icon: 'shield',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Recursos Humanos',
    description: 'Onboarding, cultura organizacional y gestión de talento',
    color: '#3b82f6',
    icon: 'group',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Liderazgo y Management',
    description: 'Desarrollo de habilidades directivas y gestión de equipos',
    color: '#8b5cf6',
    icon: 'workspace_premium',
    isActive: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: 'Herramientas Digitales',
    description: 'Excel, CRM, y software empresarial esencial',
    color: '#f59e0b',
    icon: 'computer',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Mock Topics
const createMockTopics = (videoId: string, count: number): Topic[] => {
  const topics: Topic[] = [];
  for (let i = 0; i < count; i++) {
    topics.push({
      id: `${videoId}-topic-${i + 1}`,
      code: `${i + 1}.${i + 1}`,
      title: `Tema ${i + 1}: Conceptos y Aplicaciones`,
      description: `Descripción detallada del tema ${i + 1}`,
      timestamp: i * 180, // 3 minutes apart
      duration: 10 + Math.floor(Math.random() * 20),
      videoId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return topics;
};

// Mock Videos
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Técnicas de Ventas 2024',
    description: 'Estrategias avanzadas para cierre de negocios B2B y gestión de objeciones.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    externalId: 'SLS-101',
    platform: 'YOUTUBE',
    categoryId: 1,
    category: mockCategories[0],
    topics: createMockTopics('1', 12),
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Seguridad Industrial',
    description: 'Protocolos de seguridad para planta y almacén. Normativas vigentes.',
    url: 'https://www.youtube.com/watch?v=example2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
    externalId: 'SEC-204',
    platform: 'YOUTUBE',
    categoryId: 2,
    category: mockCategories[1],
    topics: createMockTopics('2', 8),
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Onboarding Corporativo',
    description: 'Introducción a la cultura y valores de Multicentro. Bienvenida integral.',
    url: 'https://www.youtube.com/watch?v=example3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    externalId: 'HR-001',
    platform: 'YOUTUBE',
    categoryId: 3,
    category: mockCategories[2],
    topics: createMockTopics('3', 5),
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    title: 'Liderazgo Efectivo',
    description: 'Gestión de equipos remotos y motivación. Técnicas de coaching.',
    url: 'https://www.youtube.com/watch?v=example4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    externalId: 'MGT-305',
    platform: 'YOUTUBE',
    categoryId: 4,
    category: mockCategories[3],
    topics: createMockTopics('4', 24),
    isActive: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    title: 'Excel Avanzado',
    description: 'Tablas dinámicas, macros y visualización de datos profesional.',
    url: 'https://www.youtube.com/watch?v=example5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    externalId: 'TEC-502',
    platform: 'YOUTUBE',
    categoryId: 5,
    category: mockCategories[4],
    topics: createMockTopics('5', 18),
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    title: 'Negociación Estratégica',
    description: 'Arte de la negociación en contextos corporativos complejos.',
    url: 'https://www.youtube.com/watch?v=example6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    externalId: 'SLS-102',
    platform: 'YOUTUBE',
    categoryId: 1,
    category: mockCategories[0],
    topics: createMockTopics('6', 15),
    isActive: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '7',
    title: 'Prevención de Riesgos',
    description: 'Identificación y mitigación de riesgos laborales.',
    url: 'https://www.youtube.com/watch?v=example7',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    externalId: 'SEC-205',
    platform: 'YOUTUBE',
    categoryId: 2,
    category: mockCategories[1],
    topics: createMockTopics('7', 10),
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '8',
    title: 'Gestión del Desempeño',
    description: 'Evaluaciones, feedback y planes de desarrollo individual.',
    url: 'https://www.youtube.com/watch?v=example8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    externalId: 'HR-002',
    platform: 'YOUTUBE',
    categoryId: 3,
    category: mockCategories[2],
    topics: createMockTopics('8', 14),
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

// Add videos to categories
mockCategories[0].videos = [mockVideos[0], mockVideos[5]];
mockCategories[1].videos = [mockVideos[1], mockVideos[6]];
mockCategories[2].videos = [mockVideos[2], mockVideos[7]];
mockCategories[3].videos = [mockVideos[3]];
mockCategories[4].videos = [mockVideos[4]];

// Mock User
export const mockUser: User = {
  id: '1',
  username: 'Roberto Gómez',
  email: 'roberto.gomez@multicentro.com',
  role: 'student',
  createdAt: new Date('2024-01-01'),
};

// Helper function to get random videos
export const getRandomVideos = (count: number): Video[] => {
  const shuffled = [...mockVideos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random categories
export const getRandomCategories = (count: number): Category[] => {
  const shuffled = [...mockCategories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
