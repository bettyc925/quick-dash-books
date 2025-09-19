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

  // Load selections from sessionStorage on mount for better security
  useEffect(() => {
    const storedBusiness = sessionStorage.getItem('selectedBusiness');
    const storedClient = sessionStorage.getItem('selectedClient');
    
    if (storedBusiness) {
      try {
        setSelectedBusiness(JSON.parse(storedBusiness));
      } catch (error) {
        sessionStorage.removeItem('selectedBusiness');
      }
    }
    
    if (storedClient) {
      try {
        setSelectedClient(JSON.parse(storedClient));
      } catch (error) {
        sessionStorage.removeItem('selectedClient');
      }
    }
  }, []);

  // Auto-cleanup selections after inactivity
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Clear selections after 30 minutes of inactivity
      setSelectedBusiness(null);
      setSelectedClient(null);
    }, 30 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [selectedBusiness, selectedClient]);

  // Clear selections when user signs out and cleanup storage
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSelectedBusiness(null);
          setSelectedClient(null);
          // Clear all sensitive data from storage
          sessionStorage.removeItem('selectedBusiness');
          sessionStorage.removeItem('selectedClient');
          localStorage.removeItem('selectedBusiness');
          localStorage.removeItem('selectedClient');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Save selections to sessionStorage for better security
  useEffect(() => {
    if (selectedBusiness) {
      sessionStorage.setItem('selectedBusiness', JSON.stringify(selectedBusiness));
    } else {
      sessionStorage.removeItem('selectedBusiness');
    }
  }, [selectedBusiness]);

  useEffect(() => {
    if (selectedClient) {
      sessionStorage.setItem('selectedClient', JSON.stringify(selectedClient));
    } else {
      sessionStorage.removeItem('selectedClient');
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