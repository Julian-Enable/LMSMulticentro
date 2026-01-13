export const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const VIDEO_PLATFORMS = {
  YOUTUBE: 'YOUTUBE',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  DRIVE: 'DRIVE',
  VIMEO: 'VIMEO',
  OTHER: 'OTHER'
} as const;

export const USER_ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  SUPERVISOR: 'SUPERVISOR',
  ADMIN: 'ADMIN'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'lms_token',
  USER: 'lms_user'
} as const;
