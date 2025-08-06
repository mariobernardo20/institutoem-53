-- Create user profiles with roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for radio
CREATE TABLE public.radio_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.radio_programs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create polls table for radio
CREATE TABLE public.radio_polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  options JSONB NOT NULL DEFAULT '[]', -- Array of poll options
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.radio_programs(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create poll votes table
CREATE TABLE public.radio_poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.radio_polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_id) -- One vote per user per poll
);

-- Create admin activity logs
CREATE TABLE public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_range TEXT,
  employment_type TEXT NOT NULL DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  deadline DATE,
  requirements TEXT,
  application_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE profiles.user_id = get_user_role.user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- RLS Policies for radio comments
CREATE POLICY "Everyone can view radio comments" ON public.radio_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.radio_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.radio_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.radio_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all comments" ON public.radio_comments FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- RLS Policies for radio polls
CREATE POLICY "Everyone can view active polls" ON public.radio_polls FOR SELECT USING (is_active = true OR public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage polls" ON public.radio_polls FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- RLS Policies for poll votes
CREATE POLICY "Everyone can view poll votes" ON public.radio_poll_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.radio_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.radio_poll_votes FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for admin logs
CREATE POLICY "Admins can view logs" ON public.admin_logs FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can create logs" ON public.admin_logs FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- RLS Policies for contact messages
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- RLS Policies for jobs
CREATE POLICY "Everyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = true OR public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- RLS Policies for scholarships
CREATE POLICY "Everyone can view active scholarships" ON public.scholarships FOR SELECT USING (is_active = true OR public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage scholarships" ON public.scholarships FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_radio_comments_updated_at BEFORE UPDATE ON public.radio_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_radio_polls_updated_at BEFORE UPDATE ON public.radio_polls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON public.scholarships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for real-time admin features
ALTER TABLE public.radio_comments REPLICA IDENTITY FULL;
ALTER TABLE public.radio_polls REPLICA IDENTITY FULL;
ALTER TABLE public.radio_poll_votes REPLICA IDENTITY FULL;
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER TABLE public.admin_logs REPLICA IDENTITY FULL;