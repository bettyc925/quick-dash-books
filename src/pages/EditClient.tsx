import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText, sanitizeTextArea } from '@/utils/inputSanitization';
import { ArrowLeft } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  industry?: string;
  currency: string;
  gaap_standard?: string;
  fiscal_year_end?: string;
}

const EditClient = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    industry: '',
    currency: 'USD',
    gaapStandard: 'US_GAAP',
    fiscalYearEnd: '2024-12-31'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Apply appropriate sanitization based on field
    if (name === 'companyName') {
      sanitizedValue = sanitizeText(value);
    } else if (name === 'address') {
      sanitizedValue = sanitizeTextArea(value);
    } else if (name === 'email') {
      sanitizedValue = value.toLowerCase().trim();
    } else if (name === 'phone') {
      sanitizedValue = value.replace(/[^\d\-+\(\)\s]/g, '').trim();
    } else {
      sanitizedValue = sanitizeText(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const setValues = (newValues: typeof formData) => {
    setFormData(newValues);
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!companyId) {
      navigate('/company-selection');
      return;
    }

    loadCompany();
  }, [user, companyId, navigate]);

  const loadCompany = async () => {
    if (!companyId || !user) return;

    try {
      setLoadingCompany(true);
      
      // Check if user has access to this company
      const { data: userCompany, error: accessError } = await supabase
        .from('user_companies')
        .select('role')
        .eq('user_id', user.id)
        .eq('company_id', companyId)
        .single();

      if (accessError || !userCompany) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to edit this company.",
        });
        navigate('/company-selection');
        return;
      }

      // Check if user has edit permissions
      if (!['admin', 'editor'].includes(userCompany.role)) {
        toast({
          variant: "destructive",
          title: "Insufficient Permissions",
          description: "You need admin or editor permissions to edit this company.",
        });
        navigate('/company-selection');
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) {
        throw companyError;
      }

      setCompany(companyData);
      setValues({
        companyName: companyData.name || '',
        email: companyData.email || '',
        phone: companyData.phone || '',
        address: companyData.address || '',
        taxId: companyData.tax_id || '',
        industry: companyData.industry || '',
        currency: companyData.currency || 'USD',
        gaapStandard: companyData.gaap_standard || 'US_GAAP',
        fiscalYearEnd: companyData.fiscal_year_end || '2024-12-31'
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load company information.",
      });
      navigate('/company-selection');
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user || !companyId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User or company information not found.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          tax_id: formData.taxId,
          industry: formData.industry,
          currency: formData.currency,
          gaap_standard: formData.gaapStandard,
          fiscal_year_end: formData.fiscalYearEnd,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Company Updated!",
        description: `${formData.companyName} has been updated successfully.`,
      });

      navigate('/company-selection');

    } catch (error: any) {
      const message = typeof error?.message === 'string' ? error.message : String(error);
      const friendly = message.includes('violates row-level security')
        ? 'Access denied by security policy. Make sure you have the correct permissions.'
        : message || 'Failed to update company.';
      toast({
        variant: "destructive",
        title: "Error",
        description: friendly,
      });
    }

    setIsLoading(false);
  };

  if (loadingCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qb-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company information...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Company Not Found</CardTitle>
            <CardDescription>
              The company you're trying to edit could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/company-selection')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/company-selection')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl font-bold text-qb-blue">Edit Company</CardTitle>
              <CardDescription>
                Update {company.name}'s information
              </CardDescription>
            </div>
            <div className="w-[76px]"></div> {/* Spacer for centering */}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleChange({ target: { name: 'industry', value } } as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleChange({ target: { name: 'currency', value } } as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gaapStandard">GAAP Standard</Label>
                <Select value={formData.gaapStandard} onValueChange={(value) => handleChange({ target: { name: 'gaapStandard', value } } as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GAAP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US_GAAP">US GAAP</SelectItem>
                    <SelectItem value="IFRS">IFRS</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
              <Input
                id="fiscalYearEnd"
                name="fiscalYearEnd"
                type="date"
                value={formData.fiscalYearEnd}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/company-selection')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="flex-1 bg-qb-blue hover:bg-qb-blue-dark"
              >
                {isLoading ? 'Updating...' : 'Update Company'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditClient;