import { Tables } from "@/integrations/supabase/types";

export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  position?: string;
  experience_years?: number;
  skills?: string[];
  photo_url?: string;
  resume_url?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  // Legacy fields for compatibility
  name: string;
  area: string;
  description: string;
  image_url?: string;
  location?: string;
  education?: string;
  certifications?: string[];
  languages?: string[];
};

export type RadioProgram = {
  id: string;
  title: string;
  host_name?: string;
  description?: string;
  schedule_time?: string;
  schedule_days?: string[];
  duration_minutes?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  // Legacy fields for compatibility
  name: string;
  host: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export type NewsItem = Tables<"news">;