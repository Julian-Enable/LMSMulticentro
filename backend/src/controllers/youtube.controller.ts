import { Request, Response } from 'express';
import { getYouTubeVideoInfo } from '../services/youtube.service';

export const fetchVideoInfo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const videoInfo = await getYouTubeVideoInfo(videoId as string);
    res.json(videoInfo);
  } catch (error: any) {
    console.error('Error in fetchVideoInfo:', error);
    res.status(500).json({ message: error.message || 'Error fetching video information' });
  }
};
