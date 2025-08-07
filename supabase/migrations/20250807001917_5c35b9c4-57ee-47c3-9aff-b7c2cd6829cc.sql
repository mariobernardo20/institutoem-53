-- Configure Realtime for all main tables
ALTER TABLE public.news REPLICA IDENTITY FULL;
ALTER TABLE public.candidates REPLICA IDENTITY FULL;
ALTER TABLE public.radio_programs REPLICA IDENTITY FULL;
ALTER TABLE public.radio_comments REPLICA IDENTITY FULL;
ALTER TABLE public.radio_polls REPLICA IDENTITY FULL;
ALTER TABLE public.radio_poll_votes REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.radio_programs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.radio_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.radio_polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.radio_poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Create performance optimized indexes (without CONCURRENTLY for transaction compatibility)
CREATE INDEX IF NOT EXISTS idx_news_category_published ON public.news(category, published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_news_status_published_at ON public.news(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_candidates_status_position ON public.candidates(status, position) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_radio_programs_active_schedule ON public.radio_programs(is_active, schedule_time) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_radio_comments_approved_created ON public.radio_comments(is_approved, created_at DESC) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_radio_polls_active_expires ON public.radio_polls(is_active, expires_at) WHERE is_active = true;