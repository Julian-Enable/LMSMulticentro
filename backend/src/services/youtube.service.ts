import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeChapter {
  title: string;
  timestamp: number;
  tags?: string[];
}

interface YouTubeVideoInfo {
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  chapters: YouTubeChapter[];
}

// Simple NLP tag generator using Spanish/English Stop words
const generateTags = (text: string): string[] => {
  const stopWords = new Set([
    // Español
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del',
    'y', 'e', 'o', 'u', 'ni', 'que', 'pero', 'mas', 'sino', 'porque',
    'a', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde', 'en', 'entre',
    'hacia', 'hasta', 'para', 'por', 'segun', 'sin', 'so', 'sobre', 'tras',
    'mi', 'tu', 'su', 'nuestro', 'vuestro', 'sus', 'mis', 'tus',
    'yo', 'tu', 'el', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas', 'me', 'te', 'se', 'nos', 'os',
    'es', 'son', 'ser', 'estar', 'como', 'cuando', 'donde', 'quien', 'cual', 'que',
    // English
    'the', 'a', 'an', 'and', 'or', 'but', 'for', 'nor', 'in', 'on', 'at', 'to', 'from',
    'by', 'with', 'about', 'as', 'of', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'it', 'they', 'them',
    // Comunes en titulos
    'curso', 'tutorial', 'clase', 'tema', 'modulo', 'video', 'parte', 'introduccion'
  ]);

  // Clean, lower, remove accents
  const cleanStr = text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s-]/g, ' ') // remove non-word chars except hyphen and space
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();

  // Filter 
  const words = cleanStr.split(' ');
  const tags = words.filter(word => 
    word.length > 2 && // Min 3 chars 
    !stopWords.has(word) && // Not a stopword
    !/^\d+$/.test(word) // Not pure numbers
  );

  return Array.from(new Set(tags)).slice(0, 5); // Return max 5 unique tags
};

// Parse timestamps from description (e.g., "0:00 Intro", "5:30 Topic 1", "1:23:45 Topic 2")
const parseChaptersFromDescription = (description: string, parentTitle: string = ''): YouTubeChapter[] => {
  const chapters: YouTubeChapter[] = [];
  const lines = description.split('\n');
  
  // Regex to match timestamps: 0:00, 5:30, 1:23:45, etc.
  const timestampRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(.+)$/;
  
  for (const line of lines) {
    const match = line.trim().match(timestampRegex);
    if (match) {
      const hours = match[3] ? parseInt(match[1]) : 0;
      const minutes = match[3] ? parseInt(match[2]) : parseInt(match[1]);
      const seconds = match[3] ? parseInt(match[3]) : parseInt(match[2]);
      const title = match[4].trim();
      
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // Merge parent video keywords with specific chapter keywords
      const parentTags = generateTags(parentTitle);
      const chapterTags = generateTags(title);
      const mergedTags = Array.from(new Set([...chapterTags, ...parentTags])).slice(0, 5);

      chapters.push({ 
        title, 
        timestamp: totalSeconds,
        tags: mergedTags
      });
    }
  }
  
  return chapters;
};

// Convert ISO 8601 duration (PT1H2M10S) to seconds
const parseDuration = (isoDuration: string): number => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = isoDuration.match(regex);
  
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
};

export const getYouTubeVideoInfo = async (videoId: string): Promise<YouTubeVideoInfo> => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    const duration = parseDuration(contentDetails.duration);
    const thumbnailUrl = snippet.thumbnails.high?.url || snippet.thumbnails.default?.url || '';
    const chapters = parseChaptersFromDescription(snippet.description, snippet.title);

    return {
      title: snippet.title,
      description: snippet.description,
      duration,
      thumbnailUrl,
      chapters,
    };
  } catch (error: any) {
    console.error('Error fetching YouTube video info:', error.message);
    throw new Error('Failed to fetch video information from YouTube');
  }
};
