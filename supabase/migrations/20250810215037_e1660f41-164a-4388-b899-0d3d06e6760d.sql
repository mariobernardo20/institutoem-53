-- Add is_featured column to news table
ALTER TABLE public.news ADD COLUMN is_featured boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.news.is_featured IS 'Indicates if the news item should be featured on the homepage';