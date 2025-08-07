import React, { useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import useAuthStore, { useUser, useProfile, useAuthLoading, useIsAdmin } from '@/stores/authStore';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const profile = useProfile();
  const loading = useAuthLoading();
  const isAdmin = useIsAdmin();
  
  const {
    setUser,
    setSession,
    setProfile,
    setLoading,
    setIsAdmin,
    signOut: storeSignOut,
    updateActivity,
    checkSession
  } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          updateActivity();
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Auto logout on session expiry
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const isValid = await checkSession();
      if (!isValid) {
        console.log('Session expired, signing out');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, checkSession]);

  // Activity tracking
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => updateActivity();
    
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [user, updateActivity]);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as any);
      }

      // Check admin status
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('status, role')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      const adminFromProfile = profileData?.role === 'admin' || profileData?.role === 'super_admin';
      const adminFromTable = !!adminData;
      
      setIsAdmin(adminFromProfile || adminFromTable);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          }
        }
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session: useAuthStore.getState().session,
    profile,
    loading,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: storeSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}