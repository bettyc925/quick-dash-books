-- Fix company financial data security vulnerabilities (final corrected version)
-- This addresses the issue where competitors could potentially access company data

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can create companies with proper authorization" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can create companies with proper authorizat" ON public.companies;

-- Create a more secure INSERT policy that ensures:
-- 1. Only authenticated users can create companies
-- 2. The creator will be automatically granted admin access via trigger
CREATE POLICY "Secure company creation policy" 
ON public.companies 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Ensure user is authenticated and has a completed profile
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.setup_completed = true
  )
);

-- Create a function to automatically create admin relationship when company is created
CREATE OR REPLACE FUNCTION public.handle_new_company()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically create an admin relationship for the user who created the company
  INSERT INTO public.user_companies (user_id, company_id, role)
  VALUES (auth.uid(), NEW.id, 'admin');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically establish admin relationship
DROP TRIGGER IF EXISTS on_company_created ON public.companies;
CREATE TRIGGER on_company_created
  AFTER INSERT ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_company();

-- Enhance the SELECT policy to add additional security checks
DROP POLICY IF EXISTS "Users can view companies they have access to" ON public.companies;
DROP POLICY IF EXISTS "Users can view companies with verified access only" ON public.companies;
CREATE POLICY "Secure company viewing policy" 
ON public.companies 
FOR SELECT 
TO authenticated
USING (
  -- Users can only see companies where they have an active relationship
  id IN (
    SELECT uc.company_id 
    FROM public.user_companies uc
    WHERE uc.user_id = auth.uid()
    -- Additional security: ensure the relationship is active and user profile is complete
    AND uc.role IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.setup_completed = true
    )
  )
);

-- Enhance UPDATE policy for additional security
DROP POLICY IF EXISTS "Users can update companies they have admin access to" ON public.companies;
DROP POLICY IF EXISTS "Users can update companies with verified admin access" ON public.companies;
CREATE POLICY "Secure company update policy" 
ON public.companies 
FOR UPDATE 
TO authenticated
USING (
  id IN (
    SELECT uc.company_id 
    FROM public.user_companies uc
    WHERE uc.user_id = auth.uid()
    AND uc.role IN ('admin', 'editor')
    -- Ensure user profile exists and is properly set up
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.setup_completed = true
    )
  )
)
WITH CHECK (
  id IN (
    SELECT uc.company_id 
    FROM public.user_companies uc
    WHERE uc.user_id = auth.uid()
    AND uc.role IN ('admin', 'editor')
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.setup_completed = true
    )
  )
);

-- Add a DELETE policy for company cleanup (only admins can delete)
DROP POLICY IF EXISTS "Only company admins can delete companies" ON public.companies;
CREATE POLICY "Secure company deletion policy" 
ON public.companies 
FOR DELETE 
TO authenticated
USING (
  id IN (
    SELECT uc.company_id 
    FROM public.user_companies uc
    WHERE uc.user_id = auth.uid()
    AND uc.role = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.setup_completed = true
    )
  )
);

-- Enhance user_companies policies to prevent unauthorized relationship creation
DROP POLICY IF EXISTS "Users can create company relationships for themselves" ON public.user_companies;
DROP POLICY IF EXISTS "Users can create verified company relationships" ON public.user_companies;
CREATE POLICY "Secure user company relationship creation" 
ON public.user_companies 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Users can only create relationships for themselves
  user_id = auth.uid()
  -- And only if they have a properly set up profile
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.setup_completed = true
  )
);