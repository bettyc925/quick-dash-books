-- Fix exchange rates security by restricting access to company-related users only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view exchange rates" ON public.exchange_rates;

-- Create more restrictive policies for exchange rates
-- Only allow users who have access to companies with different currencies to view exchange rates
CREATE POLICY "Users can view exchange rates for their company currencies" 
ON public.exchange_rates 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if user has companies that use these currencies
  from_currency IN (
    SELECT DISTINCT c.currency 
    FROM companies c
    JOIN user_companies uc ON c.id = uc.company_id
    WHERE uc.user_id = auth.uid()
  ) OR
  to_currency IN (
    SELECT DISTINCT c.currency 
    FROM companies c
    JOIN user_companies uc ON c.id = uc.company_id
    WHERE uc.user_id = auth.uid()
  ) OR
  -- Always allow USD rates since it's the base currency
  from_currency = 'USD' OR to_currency = 'USD'
);

-- Allow administrators to insert/update exchange rates
CREATE POLICY "Admins can manage exchange rates" 
ON public.exchange_rates 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_companies uc
    JOIN companies c ON uc.company_id = c.id
    WHERE uc.user_id = auth.uid() 
    AND uc.role IN ('admin')
  )
);