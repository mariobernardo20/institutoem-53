-- Add is_approved column to radio_comments table
ALTER TABLE public.radio_comments 
ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT false;