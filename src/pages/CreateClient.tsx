import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreateClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [industry, setIndustry] = useState('');
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Only bookkeepers can create clients
    if (!profile?.role.startsWith('bookkeeper')) {
      navigate('/dashboard');
      return;
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not found. Please log in again.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          email: email,
          phone: phone,
          address: address,
          tax_id: taxId,
          industry: industry,
        })
        .select()
        .single();

      if (companyError) {
        throw companyError;
      }

      // Create the user-company relationship
      const { error: relationError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: company.id,
          role: 'admin', // Bookkeeper gets admin access to their clients
        });

      if (relationError) {
        throw relationError;
      }

      toast({
        title: "Client Created!",
        description: `${companyName} has been added to your client list.`,
      });

      // Navigate to dashboard with the new company selected
      navigate(`/dashboard?company=${company.id}`);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create client.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-qb-green">Add Your First Client</CardTitle>
          <CardDescription>
            Create a client company to start managing their books
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                type="text"
                placeholder="Client company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Company address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID / EIN</Label>
                <Input
                  id="tax-id"
                  type="text"
                  placeholder="12-3456789"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  type="text"
                  placeholder="e.g., Retail, Consulting"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/client-list')}
              >
                Skip for Now
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-qb-green hover:bg-qb-green-dark text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateClient;
