import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  lastActivity: number;
  sessionExpiry: number | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  updateActivity: () => void;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const useAuthStore = create<AuthState & AuthActions>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // State
        user: null,
        session: null,
        profile: null,
        loading: false,
        isAdmin: false,
        lastActivity: Date.now(),
        sessionExpiry: null,

        // Actions
        setUser: (user) => set({ user }),
        setSession: (session) => {
          set({ 
            session, 
            sessionExpiry: session?.expires_at ? session.expires_at * 1000 : null 
          });
        },
        setProfile: (profile) => set({ profile }),
        setLoading: (loading) => set({ loading }),
        setIsAdmin: (isAdmin) => set({ isAdmin }),
        updateActivity: () => set({ lastActivity: Date.now() }),

        signOut: async () => {
          try {
            await supabase.auth.signOut();
            set({
              user: null,
              session: null,
              profile: null,
              isAdmin: false,
              sessionExpiry: null
            });
          } catch (error) {
            console.error('Error signing out:', error);
          }
        },

        checkSession: async () => {
          const { sessionExpiry } = get();
          if (sessionExpiry && Date.now() > sessionExpiry) {
            await get().signOut();
            return false;
          }
          return true;
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          profile: state.profile,
          lastActivity: state.lastActivity,
          sessionExpiry: state.sessionExpiry
        })
      }
    )
  )
);

// Selectors for optimized component re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useSession = () => useAuthStore((state) => state.session);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin);
export const useAuthLoading = () => useAuthStore((state) => state.loading);

export default useAuthStore;