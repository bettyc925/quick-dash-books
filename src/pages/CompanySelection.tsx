import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building2, Mail, Phone, MapPin } from 'lucide-react';

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

const CompanySelection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const { user, profile } = useAuth();
  const { setSelectedCompany } = useCompany();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // All authenticated users should see company selection
    fetchCompanies();
  }, [user, navigate]);

  const fetchCompanies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          company_id,
          role,
          companies (
            id,
            name,
            email,
            phone,
            address,
            industry,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      const companiesData = data?.map(item => ({
        ...item.companies,
        user_role: item.role,
      })) as Company[];

      setCompanies(companiesData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load clients.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qb-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-qb-blue">Select Company</h1>
            <p className="text-muted-foreground mt-2">
              Choose which company you'd like to work with
            </p>
          </div>
          <Link to="/create-client">
            <Button className="bg-qb-blue hover:bg-qb-blue-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Companies Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by adding your first company
            </p>
            <Link to="/create-client">
              <Button className="bg-qb-blue hover:bg-qb-blue-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Company
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSelectCompany(company)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-qb-blue">
                      {company.name}
                    </CardTitle>
                    <Badge variant="secondary">
                      {company.user_role}
                    </Badge>
                  </div>
                  {company.industry && (
                    <CardDescription>{company.industry}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {company.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{company.email}</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-2">{company.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(company.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelection;
