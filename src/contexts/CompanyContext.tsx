import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  industry?: string;
  created_at: string;
  user_role: string;
}

interface CompanyContextType {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  clearSelectedCompany: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Load selected company from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedCompany');
    if (stored) {
      try {
        setSelectedCompany(JSON.parse(stored));
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('selectedCompany');
      }
    }
  }, []);

  // Clear selected company when user signs out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSelectedCompany(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Save selected company to localStorage when it changes
  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
    } else {
      localStorage.removeItem('selectedCompany');
    }
  }, [selectedCompany]);

  const clearSelectedCompany = () => {
    setSelectedCompany(null);
  };

  const value = {
    selectedCompany,
    setSelectedCompany,
    clearSelectedCompany,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};