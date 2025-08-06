-- Fix security warnings by dropping triggers first, then functions

-- Drop trigger first
DROP TRIGGER on_auth_user_created ON auth.users;

-- Drop and recreate handle_new_user function with proper search path
DROP FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop all update triggers first
DROP TRIGGER update_candidates_updated_at ON public.candidates;
DROP TRIGGER update_radio_programs_updated_at ON public.radio_programs;
DROP TRIGGER update_news_updated_at ON public.news;
DROP TRIGGER update_radio_recordings_updated_at ON public.radio_recordings;
DROP TRIGGER update_service_requests_updated_at ON public.service_requests;
DROP TRIGGER update_profiles_updated_at ON public.profiles;

-- Drop and recreate update_updated_at_column function with proper search path
DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate all update triggers
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_radio_programs_updated_at BEFORE UPDATE ON public.radio_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_radio_recordings_updated_at BEFORE UPDATE ON public.radio_recordings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();