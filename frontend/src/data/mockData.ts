import { Category, Video, Topic, User } from '../types';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Ventas Corporativas',
    description: 'Técnicas avanzadas de ventas B2B y gestión de grandes cuentas',
    order: 1,
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Compliance y Seguridad',
    description: 'Protocolos de seguridad industrial y normativas empresariales',
    order: 2,
    isActive: true,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '3',
    name: 'Recursos Humanos',
    description: 'Onboarding, cultura organizacional y gestión de talento',
    order: 3,
    isActive: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '4',
    name: 'Liderazgo y Management',
    description: 'Desarrollo de habilidades directivas y gestión de equipos',
    order: 4,
    isActive: true,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '5',
    name: 'Herramientas Digitales',
    description: 'Excel, CRM, y software empresarial esencial',
    order: 5,
    isActive: true,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
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
      order: i + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    externalId: 'SLS-101',
    platform: 'YOUTUBE',
    categoryId: '1',
    category: mockCategories[0],
    order: 1,
    isActive: true,
    topics: createMockTopics('1', 12),
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Seguridad Industrial',
    description: 'Protocolos de seguridad para planta y almacén. Normativas vigentes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
    externalId: 'SEC-204',
    platform: 'YOUTUBE',
    categoryId: '2',
    category: mockCategories[1],
    order: 1,
    isActive: true,
    topics: createMockTopics('2', 8),
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '3',
    title: 'Onboarding Corporativo',
    description: 'Introducción a la cultura y valores de Multicentro. Bienvenida integral.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    externalId: 'HR-001',
    platform: 'YOUTUBE',
    categoryId: '3',
    category: mockCategories[2],
    order: 1,
    isActive: true,
    topics: createMockTopics('3', 5),
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '4',
    title: 'Liderazgo Efectivo',
    description: 'Gestión de equipos remotos y motivación. Técnicas de coaching.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    externalId: 'MGT-305',
    platform: 'YOUTUBE',
    categoryId: '4',
    category: mockCategories[3],
    order: 1,
    isActive: true,
    topics: createMockTopics('4', 24),
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '5',
    title: 'Excel Avanzado',
    description: 'Tablas dinámicas, macros y visualización de datos profesional.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    externalId: 'TEC-502',
    platform: 'YOUTUBE',
    categoryId: '5',
    category: mockCategories[4],
    order: 1,
    isActive: true,
    topics: createMockTopics('5', 18),
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '6',
    title: 'Negociación Estratégica',
    description: 'Arte de la negociación en contextos corporativos complejos.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    externalId: 'SLS-102',
    platform: 'YOUTUBE',
    categoryId: '1',
    category: mockCategories[0],
    order: 2,
    isActive: true,
    topics: createMockTopics('6', 15),
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: '7',
    title: 'Prevención de Riesgos',
    description: 'Identificación y mitigación de riesgos laborales.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    externalId: 'SEC-205',
    platform: 'YOUTUBE',
    categoryId: '2',
    category: mockCategories[1],
    order: 2,
    isActive: true,
    topics: createMockTopics('7', 10),
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '8',
    title: 'Gestión del Desempeño',
    description: 'Evaluaciones, feedback y planes de desarrollo individual.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    externalId: 'HR-002',
    platform: 'YOUTUBE',
    categoryId: '3',
    category: mockCategories[2],
    order: 2,
    isActive: true,
    topics: createMockTopics('8', 14),
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
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
  role: 'EMPLOYEE',
  createdAt: new Date('2024-01-01').toISOString(),
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
