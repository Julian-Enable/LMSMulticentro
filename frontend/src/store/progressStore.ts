import { create } from 'zustand';
import { progressService } from '../services/progress.service';

interface ProgressStore {
  // courseId/categoryId -> Set of completed topic IDs
  progressByCourse: Record<string, Set<string>>;
  loading: Record<string, boolean>;
  
  // Actions
  initProgress: (categoryId: string) => Promise<void>;
  initAllProgress: () => Promise<void>;
  markComplete: (categoryId: string, topicId: string) => Promise<void>;
  unmarkComplete: (categoryId: string, topicId: string) => Promise<void>;
  toggleComplete: (categoryId: string, topicId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progressByCourse: {},
  loading: {},

  initProgress: async (categoryId: string) => {
    // If already loading, skip
    if (get().loading[categoryId]) return;

    set((state) => ({ loading: { ...state.loading, [categoryId]: true } }));

    let completedIds: string[] = [];

    try {
      // 1. Backend Fetch
      completedIds = await progressService.getCategoryProgress(categoryId);
      // Cache in local storage for instant loads next time
      localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(completedIds));
    } catch {
      // 2. Fallback to local storage (optimistic offline support)
      const saved = localStorage.getItem(`course-progress-${categoryId}`);
      if (saved) {
        try {
          completedIds = JSON.parse(saved);
        } catch {
          completedIds = [];
        }
      }
    }

    set((state) => ({
      progressByCourse: {
        ...state.progressByCourse,
        [categoryId]: new Set(completedIds),
      },
      loading: { ...state.loading, [categoryId]: false },
    }));
  },

  initAllProgress: async () => {
    // We can use a special "all" key for loading state
    if (get().loading['all']) return;
    
    set((state) => ({ loading: { ...state.loading, all: true } }));

    try {
      const allProgress = await progressService.getAllProgress();
      
      const newProgressByCourse: Record<string, Set<string>> = {};
      
      allProgress.forEach(record => {
        const categoryId = record.topic?.video?.category?.id;
        if (categoryId) {
          if (!newProgressByCourse[categoryId]) {
            newProgressByCourse[categoryId] = new Set<string>();
          }
          newProgressByCourse[categoryId].add(record.topicId);
        }
      });

      // Update local storage for each category
      Object.keys(newProgressByCourse).forEach(categoryId => {
        const idsArray = Array.from(newProgressByCourse[categoryId]);
        localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(idsArray));
      });

      set((state) => ({
        progressByCourse: {
          ...state.progressByCourse,
          ...newProgressByCourse
        },
        loading: { ...state.loading, all: false }
      }));
    } catch (error) {
      console.error('Failed to fetch all progress', error);
      set((state) => ({ loading: { ...state.loading, all: false } }));
    }
  },

  markComplete: async (categoryId: string, topicId: string) => {
    // Optimistic UI update
    const currentSet = get().progressByCourse[categoryId] || new Set<string>();
    const newSet = new Set(currentSet);
    newSet.add(topicId);

    set((state) => ({
      progressByCourse: {
        ...state.progressByCourse,
        [categoryId]: newSet,
      },
    }));

    // Update Cache
    localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(Array.from(newSet)));

    // Try Network Sync
    try {
      await progressService.markComplete(topicId);
    } catch {
      // In a real prod environment we could add retry queues here
    }
  },

  unmarkComplete: async (categoryId: string, topicId: string) => {
    // Optimistic UI update
    const currentSet = get().progressByCourse[categoryId] || new Set<string>();
    const newSet = new Set(currentSet);
    newSet.delete(topicId);

    set((state) => ({
      progressByCourse: {
        ...state.progressByCourse,
        [categoryId]: newSet,
      },
    }));

    // Update Cache
    localStorage.setItem(`course-progress-${categoryId}`, JSON.stringify(Array.from(newSet)));

    // Try Network Sync
    try {
      await progressService.unmarkComplete(topicId);
    } catch {
      // Fail silently
    }
  },

  toggleComplete: async (categoryId: string, topicId: string) => {
    const currentSet = get().progressByCourse[categoryId];
    if (currentSet?.has(topicId)) {
      await get().unmarkComplete(categoryId, topicId);
    } else {
      await get().markComplete(categoryId, topicId);
    }
  },
}));
