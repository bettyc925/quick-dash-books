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

interface Business {
  id: string;
  name: string;
  user_role: string;
  clients?: Company[];
}

interface CompanyContextType {
  selectedBusiness: Business | null;
  selectedClient: Company | null;
  setSelectedBusiness: (business: Business | null) => void;
  setSelectedClient: (client: Company | null) => void;
  clearSelections: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedClient, setSelectedClient] = useState<Company | null>(null);

  // Load selections from localStorage on mount
  useEffect(() => {
    const storedBusiness = localStorage.getItem('selectedBusiness');
    const storedClient = localStorage.getItem('selectedClient');
    
    if (storedBusiness) {
      try {
        setSelectedBusiness(JSON.parse(storedBusiness));
      } catch (error) {
        localStorage.removeItem('selectedBusiness');
      }
    }
    
    if (storedClient) {
      try {
        setSelectedClient(JSON.parse(storedClient));
      } catch (error) {
        localStorage.removeItem('selectedClient');
      }
    }
  }, []);

  // Clear selections when user signs out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSelectedBusiness(null);
          setSelectedClient(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Save selections to localStorage when they change
  useEffect(() => {
    if (selectedBusiness) {
      localStorage.setItem('selectedBusiness', JSON.stringify(selectedBusiness));
    } else {
      localStorage.removeItem('selectedBusiness');
    }
  }, [selectedBusiness]);

  useEffect(() => {
    if (selectedClient) {
      localStorage.setItem('selectedClient', JSON.stringify(selectedClient));
    } else {
      localStorage.removeItem('selectedClient');
    }
  }, [selectedClient]);

  const clearSelections = () => {
    setSelectedBusiness(null);
    setSelectedClient(null);
  };

  const value = {
    selectedBusiness,
    selectedClient,
    setSelectedBusiness,
    setSelectedClient,
    clearSelections,
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