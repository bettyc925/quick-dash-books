-- First, update the user_role enum to include bookkeeper access levels
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'bookkeeper_basic';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'bookkeeper_pro';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'bookkeeper_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'client';

-- Create companies table for client companies
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  tax_id TEXT,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create user_companies junction table for bookkeeper-client relationships
CREATE TABLE public.user_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Enable RLS on user_companies
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- Update profiles table to include setup completion status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Create policies for companies table
CREATE POLICY "Users can view companies they have access to" 
ON public.companies 
FOR SELECT 
USING (
  id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update companies they have admin access to" 
ON public.companies 
FOR UPDATE 
USING (
  id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Create policies for user_companies table
CREATE POLICY "Users can view their own company relationships" 
ON public.user_companies 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create company relationships for themselves" 
ON public.user_companies 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own company relationships" 
ON public.user_companies 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add triggers for updated_at columns
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to set default role based on signup data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, company_name, role, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'client' THEN 'client'::user_role
      WHEN NEW.raw_user_meta_data->>'user_type' = 'bookkeeper' THEN 'bookkeeper_basic'::user_role
      ELSE 'user'::user_role
    END,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$function$;