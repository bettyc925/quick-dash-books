-- Fix security warnings by setting search_path for functions

-- Update function to generate verification codes with proper search path
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$;

-- Update function to set verification code for merge requests with proper search path
CREATE OR REPLACE FUNCTION set_merge_request_verification_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.verification_code IS NULL OR NEW.verification_code = '' THEN
    NEW.verification_code := generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$;