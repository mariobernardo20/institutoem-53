import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Candidate } from '@/types/database';

interface CandidatesState {
  candidates: Candidate[];
  filteredCandidates: Candidate[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    position: string[];
    skills: string[];
    experience: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  lastUpdated: number;
}

interface CandidatesActions {
  setCandidates: (candidates: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<CandidatesState['filters']>) => void;
  filterCandidates: () => void;
  setPagination: (pagination: Partial<CandidatesState['pagination']>) => void;
  loadMore: () => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  removeCandidate: (id: string) => void;
}

const useCandidatesStore = create<CandidatesState & CandidatesActions>()(
  subscribeWithSelector((set, get) => ({
    // State
    candidates: [],
    filteredCandidates: [],
    loading: false,
    error: null,
    searchQuery: '',
    filters: {
      position: [],
      skills: [],
      experience: ''
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      hasMore: true
    },
    lastUpdated: 0,

    // Actions
    setCandidates: (candidates) => {
      set({ candidates, lastUpdated: Date.now() });
      get().filterCandidates();
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    setSearchQuery: (query) => {
      set({ searchQuery: query });
      get().filterCandidates();
    },

    setFilters: (newFilters) => {
      set({ filters: { ...get().filters, ...newFilters } });
      get().filterCandidates();
    },

    filterCandidates: () => {
      const { candidates, searchQuery, filters } = get();
      let filtered = [...candidates];

      // Search by name, position, or skills
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(candidate => 
          candidate.full_name?.toLowerCase().includes(query) ||
          candidate.position?.toLowerCase().includes(query) ||
          candidate.skills?.some(skill => skill.toLowerCase().includes(query))
        );
      }

      // Filter by position
      if (filters.position.length > 0) {
        filtered = filtered.filter(candidate =>
          filters.position.some(pos => 
            candidate.position?.toLowerCase().includes(pos.toLowerCase())
          )
        );
      }

      // Filter by skills
      if (filters.skills.length > 0) {
        filtered = filtered.filter(candidate =>
          candidate.skills?.some(skill =>
            filters.skills.some(filterSkill =>
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }

      // Filter by experience
      if (filters.experience) {
        const experienceYears = parseInt(filters.experience);
        filtered = filtered.filter(candidate => {
          const candExp = candidate.experience_years || 0;
          switch (filters.experience) {
            case '0-2': return candExp <= 2;
            case '3-5': return candExp >= 3 && candExp <= 5;
            case '6-10': return candExp >= 6 && candExp <= 10;
            case '10+': return candExp > 10;
            default: return true;
          }
        });
      }

      set({ filteredCandidates: filtered });
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

    updateCandidate: (id, updates) => {
      const { candidates } = get();
      const updatedCandidates = candidates.map(candidate =>
        candidate.id === id ? { ...candidate, ...updates } : candidate
      );
      set({ candidates: updatedCandidates });
      get().filterCandidates();
    },

    removeCandidate: (id) => {
      const { candidates } = get();
      const filteredCandidates = candidates.filter(candidate => candidate.id !== id);
      set({ candidates: filteredCandidates });
      get().filterCandidates();
    }
  }))
);

// Selectors
export const useCandidates = () => useCandidatesStore((state) => state.filteredCandidates);
export const useCandidatesLoading = () => useCandidatesStore((state) => state.loading);
export const useCandidatesError = () => useCandidatesStore((state) => state.error);
export const useCandidatesSearch = () => useCandidatesStore((state) => state.searchQuery);
export const useCandidatesFilters = () => useCandidatesStore((state) => state.filters);

export default useCandidatesStore;