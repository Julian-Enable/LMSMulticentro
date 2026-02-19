import api from './api';

export interface ProgressRecord {
  topicId: string;
  completedAt?: string;
  topic?: {
    id: string;
    title: string;
    code: string;
    video?: {
      id: string;
      title: string;
      category?: { id: string; name: string };
    };
  };
}

export const progressService = {
  // Get completed topicIds for a specific course category
  getCategoryProgress: async (categoryId: string): Promise<string[]> => {
    const response = await api.get(`/progress/${categoryId}`);
    return response.data.completedTopics;
  },

  // Get all user progress across all courses
  getAllProgress: async (): Promise<ProgressRecord[]> => {
    const response = await api.get('/progress/all');
    return response.data.completedTopics;
  },

  // Mark a topic as completed
  markComplete: async (topicId: string): Promise<void> => {
    await api.post('/progress/complete', { topicId });
  },

  // Unmark a topic as completed
  unmarkComplete: async (topicId: string): Promise<void> => {
    await api.delete('/progress/complete', { data: { topicId } });
  },
};
