import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useIdleTimer } from './useIdleTimer';

interface Profile {
  id: string;
  user_id: string;
  company_name: string;
  role: 'admin' | 'user' | 'manager' | 'bookkeeper_basic' | 'bookkeeper_pro' | 'bookkeeper_admin' | 'client';
  setup_completed: boolean;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  business_name: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    companyName: string;
    userType: 'bookkeeper' | 'client';
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  verifyMFA: (phone: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Silently handle profile fetch errors in production
      return null;
    }
    return data;
  };

  const signOutUser = async () => {
    // Clear selected business and client when signing out
    localStorage.removeItem('selectedBusiness');
    localStorage.removeItem('selectedClient');
    await supabase.auth.signOut();
  };

  // Auto sign out after 30 minutes of inactivity
  useIdleTimer({
    timeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    onTimeout: () => {
      if (user) {
        console.log('Auto signing out due to inactivity');
        signOutUser();
      }
    }
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid auth callback issues
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: {
    companyName: string;
    userType: 'bookkeeper' | 'client';
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const redirectUrl = `${window.location.origin}/profile-setup`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          company_name: userData.companyName,
          user_type: userData.userType,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || '',
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    return { error };
  };

  const verifyMFA = async (phone: string) => {
    // MFA implementation not available in production
    // This would typically integrate with a service like Twilio
    return { 
      error: { 
        message: "Multi-factor authentication is not currently configured. Please contact support." 
      } 
    };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
    verifyMFA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};