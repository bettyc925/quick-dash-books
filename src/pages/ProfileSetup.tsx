import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProfileSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // If profile is already set up, redirect based on user type
    if (profile?.setup_completed) {
      if (profile.role.startsWith('bookkeeper')) {
        // Check if they have clients
        checkUserClients();
      } else {
        navigate('/dashboard');
      }
      return;
    }

    // Pre-fill form with existing profile data
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setBusinessName(profile.business_name || profile.company_name || '');
      setPhone(profile.phone || '');
    }
  }, [user, profile, navigate]);

  const checkUserClients = async () => {
    const { data: companies, error } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error checking user companies:', error);
      return;
    }

    if (companies && companies.length === 0) {
      navigate('/create-client');
    } else if (companies && companies.length === 1) {
      navigate(`/dashboard?company=${companies[0].company_id}`);
    } else {
      navigate('/client-list');
    }
  };

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

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        phone: phone,
        setup_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile Updated!",
        description: "Your profile has been set up successfully.",
      });

      // Redirect based on user type
      if (profile?.role.startsWith('bookkeeper')) {
        await checkUserClients();
      } else {
        navigate('/dashboard');
      }
    }

    setIsLoading(false);
  };

  const isBookkeeper = profile?.role.startsWith('bookkeeper');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-qb-green">Complete Your Profile</CardTitle>
          <CardDescription>
            {isBookkeeper 
              ? "Set up your bookkeeping business profile"
              : "Complete your profile information"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-name">
                {isBookkeeper ? 'Business Name' : 'Company Name'}
              </Label>
              <Input
                id="business-name"
                type="text"
                placeholder={isBookkeeper ? 'Your bookkeeping business name' : 'Your company name'}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-qb-green hover:bg-qb-green-dark text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;