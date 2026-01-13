export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'EMPLOYEE' | 'SUPERVISOR' | 'ADMIN';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  videoCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  externalId: string;
  platform: 'YOUTUBE' | 'GOOGLE_DRIVE' | 'VIMEO';
  duration?: number;
  thumbnailUrl?: string;
  categoryId: string;
  category?: Category;
  order: number;
  isActive: boolean;
  topics?: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  code: string;
  title: string;
  description?: string;
  videoId: string;
  video?: Video;
  timestamp: number;
  duration?: number;
  order: number;
  isActive: boolean;
  tags?: TopicTag[];
  quizzes?: Quiz[];
  relevance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  topicCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicTag {
  topicId: string;
  tagId: string;
  tag: Tag;
}

export interface Quiz {
  id: string;
  topicId: string;
  topic?: Topic;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  results: Topic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
