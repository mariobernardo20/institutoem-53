-- Add missing columns and tables

-- Add avatar_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add missing columns to news table
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Create radio_polls table
CREATE TABLE IF NOT EXISTS public.radio_polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  options JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create radio_poll_votes table
CREATE TABLE IF NOT EXISTS public.radio_poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.radio_polls(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.radio_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_poll_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for radio_polls
CREATE POLICY "Anyone can view active polls" ON public.radio_polls
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage polls" ON public.radio_polls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create policies for radio_poll_votes
CREATE POLICY "Anyone can vote on polls" ON public.radio_poll_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own votes" ON public.radio_poll_votes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all votes" ON public.radio_poll_votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_radio_polls_updated_at
  BEFORE UPDATE ON public.radio_polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();