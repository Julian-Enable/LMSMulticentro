import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeChapter {
  title: string;
  timestamp: number;
}

interface YouTubeVideoInfo {
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  chapters: YouTubeChapter[];
}

// Parse timestamps from description (e.g., "0:00 Intro", "5:30 Topic 1", "1:23:45 Topic 2")
const parseChaptersFromDescription = (description: string): YouTubeChapter[] => {
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
      chapters.push({ title, timestamp: totalSeconds });
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
    const chapters = parseChaptersFromDescription(snippet.description);

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
