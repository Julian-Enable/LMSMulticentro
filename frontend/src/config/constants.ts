export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const VIDEO_PLATFORMS = {
  YOUTUBE: 'YOUTUBE',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  VIMEO: 'VIMEO'
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
