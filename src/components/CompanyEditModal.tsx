import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText } from '@/utils/inputSanitization';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  industry?: string;
  currency?: string;
}

interface CompanyEditModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CompanyEditModal({ company, isOpen, onClose, onSuccess }: CompanyEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    currency: 'USD'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Apply appropriate sanitization based on field
    if (name === 'companyName') {
      sanitizedValue = sanitizeText(value);
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
    if (company && isOpen) {
      setValues({
        companyName: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        industry: company.industry || '',
        currency: company.currency || 'USD'
      });
    }
  }, [company, isOpen, setValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company) return;

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          industry: formData.industry,
          currency: formData.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', company.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Company Updated!",
        description: `${formData.companyName} has been updated successfully.`,
      });

      onSuccess();
      onClose();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update basic company information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <SelectItem value="">Select industry</SelectItem>
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

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-qb-blue hover:bg-qb-blue-dark">
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}