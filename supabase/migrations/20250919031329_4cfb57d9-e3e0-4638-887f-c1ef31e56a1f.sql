-- Update the existing user's role to bookkeeper_basic so they can create companies
UPDATE profiles 
SET role = 'bookkeeper_basic'::user_role 
WHERE user_id = '3f634bac-ae1b-487b-bc4a-e3b1ae197b0e' AND role = 'user'::user_role;

-- Also update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, company_name, role, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'client' THEN 'client'::user_role
      WHEN NEW.raw_user_meta_data->>'user_type' = 'bookkeeper' THEN 'bookkeeper_basic'::user_role
      -- Default new users to bookkeeper_basic if no user_type specified
      ELSE 'bookkeeper_basic'::user_role
    END,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$function$;