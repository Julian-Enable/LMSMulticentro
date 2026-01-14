import api from './api';

export interface YouTubeChapter {
  title: string;
  timestamp: number;
}

export interface YouTubeVideoInfo {
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  chapters: YouTubeChapter[];
}

export const youtubeService = {
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    const response = await api.get(`/youtube/${videoId}`);
    return response.data;
  },
};
