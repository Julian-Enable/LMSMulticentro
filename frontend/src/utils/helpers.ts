/**
 * Convierte segundos a formato MM:SS o HH:MM:SS
 */
export const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convierte formato MM:SS o HH:MM:SS a segundos
 */
export const parseTimestamp = (timestamp: string): number => {
  const parts = timestamp.split(':').map(Number);

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return 0;
};

/**
 * Obtiene la URL del video según la plataforma
 */
export const getVideoUrl = (platform: string, externalId: string): string => {
  switch (platform) {
    case 'YOUTUBE':
      return `https://www.youtube.com/watch?v=${externalId}`;
    case 'GOOGLE_DRIVE':
      return `https://drive.google.com/file/d/${externalId}/preview`;
    case 'VIMEO':
      return `https://vimeo.com/${externalId}`;
    default:
      return '';
  }
};

/**
 * Obtiene la miniatura del video según la plataforma
 */
export const getVideoThumbnail = (platform: string, externalId: string): string => {
  switch (platform) {
    case 'YOUTUBE':
      return `https://img.youtube.com/vi/${externalId}/mqdefault.jpg`;
    case 'VIMEO':
      return `https://vumbnail.com/${externalId}.jpg`;
    default:
      return '/placeholder-video.png';
  }
};

/**
 * Formatea una fecha a formato legible
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Une clases de CSS condicionalmente
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
