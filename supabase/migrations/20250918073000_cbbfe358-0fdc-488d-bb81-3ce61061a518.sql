-- Insert test user data for the QuickBooks application
-- Note: This creates profile data for testing purposes
-- The user_id values used here are sample UUIDs that can be used with test auth accounts

-- Insert test company profiles with different roles
INSERT INTO public.profiles (id, user_id, role, company_name, created_at, updated_at)
VALUES 
  -- Admin user - Full access to all features
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'admin'::user_role,
    'Acme Corporation',
    now() - interval '30 days',
    now() - interval '5 days'
  ),
  
  -- Manager user - Access to most features except taxes/accountant
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'manager'::user_role,
    'TechStart Solutions LLC',
    now() - interval '15 days',
    now() - interval '2 days'
  ),
  
  -- Regular user - Limited access to sales and expenses only
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'user'::user_role,
    'Small Business Consulting',
    now() - interval '7 days',
    now() - interval '1 day'
  ),
  
  -- Another admin for testing
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'admin'::user_role,
    'Global Enterprises Inc',
    now() - interval '60 days',
    now() - interval '10 days'
  ),
  
  -- Another manager
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    'manager'::user_role,
    'Creative Marketing Agency',
    now() - interval '20 days',
    now() - interval '3 days'
  )
ON CONFLICT (user_id) DO NOTHING;