import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { NewsItem } from '@/types/database';

interface NewsState {
  news: NewsItem[];
  filteredNews: NewsItem[];
  activeFilter: string;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  cache: Map<string, { data: NewsItem[]; timestamp: number }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

interface NewsActions {
  setNews: (news: NewsItem[]) => void;
  setActiveFilter: (filter: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToCache: (key: string, data: NewsItem[]) => void;
  getFromCache: (key: string) => NewsItem[] | null;
  filterNews: () => void;
  setPagination: (pagination: Partial<NewsState['pagination']>) => void;
  loadMore: () => void;
  refreshNews: () => Promise<void>;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const useNewsStore = create<NewsState & NewsActions>()(
  subscribeWithSelector((set, get) => ({
    // State
    news: [],
    filteredNews: [],
    activeFilter: 'Todas',
    loading: false,
    error: null,
    lastUpdated: 0,
    cache: new Map(),
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: true
    },

    // Actions
    setNews: (news) => {
      set({ news, lastUpdated: Date.now() });
      get().filterNews();
    },

    setActiveFilter: (filter) => {
      set({ activeFilter: filter });
      get().filterNews();
      // Reset pagination when filter changes
      set({ pagination: { ...get().pagination, page: 1, hasMore: true } });
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    addToCache: (key, data) => {
      const { cache } = get();
      cache.set(key, { data, timestamp: Date.now() });
      set({ cache: new Map(cache) });
    },

    getFromCache: (key) => {
      const { cache } = get();
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
      if (cached) {
        cache.delete(key);
        set({ cache: new Map(cache) });
      }
      return null;
    },

    filterNews: () => {
      const { news, activeFilter } = get();
      let filtered = news;
      
      if (activeFilter !== 'Todas') {
        filtered = news.filter(item => 
          item.category?.toLowerCase() === activeFilter.toLowerCase()
        );
      }
      
      set({ filteredNews: filtered });
    },

    setPagination: (newPagination) => {
      set({
        pagination: { ...get().pagination, ...newPagination }
      });
    },

    loadMore: () => {
      const { pagination } = get();
      if (pagination.hasMore && !get().loading) {
        set({
          pagination: { ...pagination, page: pagination.page + 1 }
        });
      }
    },

    refreshNews: async () => {
      // Clear cache for fresh data
      set({ cache: new Map() });
      set({ lastUpdated: 0 });
    }
  }))
);

// Selectors
export const useNews = () => useNewsStore((state) => state.filteredNews);
export const useNewsFilter = () => useNewsStore((state) => state.activeFilter);
export const useNewsLoading = () => useNewsStore((state) => state.loading);
export const useNewsError = () => useNewsStore((state) => state.error);
export const useNewsPagination = () => useNewsStore((state) => state.pagination);

export default useNewsStore;