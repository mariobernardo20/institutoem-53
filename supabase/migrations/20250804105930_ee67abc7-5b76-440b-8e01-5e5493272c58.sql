-- Create tables for the Instituto Empreendedor system

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  description TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create radio programs table
CREATE TABLE public.radio_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  description TEXT,
  host TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create radio recordings table
CREATE TABLE public.radio_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.radio_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  recording_date DATE NOT NULL,
  file_url TEXT NOT NULL,
  duration_minutes INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table for admin system
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for candidates (public read, admin write)
CREATE POLICY "Everyone can view candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Admins can insert candidates" ON public.candidates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can update candidates" ON public.candidates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can delete candidates" ON public.candidates FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create policies for radio programs (public read, admin write)
CREATE POLICY "Everyone can view radio programs" ON public.radio_programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage radio programs" ON public.radio_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create policies for news (public read, admin write)
CREATE POLICY "Everyone can view news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins can manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create policies for recordings (public read, admin write)
CREATE POLICY "Everyone can view recordings" ON public.radio_recordings FOR SELECT USING (true);
CREATE POLICY "Admins can manage recordings" ON public.radio_recordings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create policies for service requests (admin only)
CREATE POLICY "Admins can view service requests" ON public.service_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage service requests" ON public.service_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
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
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_radio_programs_updated_at BEFORE UPDATE ON public.radio_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_radio_recordings_updated_at BEFORE UPDATE ON public.radio_recordings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for candidates
INSERT INTO public.candidates (name, area, experience_years, email, phone, description, skills) VALUES
('Ana Silva', 'Desenvolvimento Web', 5, 'ana.silva@email.com', '+351912345678', 'Desenvolvedor full-stack especializado em React e Node.js', ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL']),
('Carlos Santos', 'Marketing Digital', 3, 'carlos.santos@email.com', '+351923456789', 'Especialista em marketing digital e redes sociais', ARRAY['SEO', 'Google Ads', 'Social Media', 'Analytics']),
('Maria Costa', 'Design Gráfico', 7, 'maria.costa@email.com', '+351934567890', 'Designer gráfico com experiência em branding e UI/UX', ARRAY['Photoshop', 'Illustrator', 'Figma', 'UI/UX']),
('João Pereira', 'Contabilidade', 10, 'joao.pereira@email.com', '+351945678901', 'Contabilista certificado com experiência em PMEs', ARRAY['Contabilidade', 'Fiscalidade', 'Excel', 'SAP']),
('Sofia Rodrigues', 'Recursos Humanos', 4, 'sofia.rodrigues@email.com', '+351956789012', 'Especialista em recrutamento e gestão de pessoas', ARRAY['Recrutamento', 'Gestão de Pessoas', 'Formação', 'Avaliação']);

-- Insert sample data for radio programs
INSERT INTO public.radio_programs (name, day_of_week, start_time, end_time, description, host) VALUES
('Empreendedorismo Matinal', 1, '08:00', '09:00', 'Programa dedicado a histórias de sucesso empresarial', 'Pedro Oliveira'),
('Debate Semanal', 3, '19:00', '20:00', 'Debates sobre temas atuais do empreendedorismo', 'Ana Ferreira'),
('Música e Negócios', 5, '17:00', '18:30', 'Programa musical com dicas de negócios', 'Ricardo Silva'),
('Entrevistas Especiais', 2, '20:00', '21:00', 'Entrevistas com empreendedores de sucesso', 'Carla Mendes'),
('Notícias do Setor', 4, '12:00', '12:30', 'Últimas notícias do mundo empresarial', 'Miguel Torres');

-- Insert sample data for news
INSERT INTO public.news (title, content, category, published_at) VALUES
('Novas Oportunidades de Financiamento para Startups', 'O governo português anunciou um novo programa de apoio financeiro...', 'Financiamento', NOW() - INTERVAL '2 hours'),
('Tendências do Empreendedorismo em 2025', 'Um estudo recente revela as principais tendências que moldarão...', 'Tendências', NOW() - INTERVAL '5 hours'),
('Sucesso de Startup Portuguesa no Mercado Internacional', 'A empresa Tech Innovation conquista mercados europeus...', 'Sucesso', NOW() - INTERVAL '1 day'),
('Novo Programa de Incubação Lançado', 'Instituto Empreendedor lança programa exclusivo de incubação...', 'Programas', NOW() - INTERVAL '2 days'),
('Digitalização das PMEs Acelera', 'Estudo mostra crescimento na digitalização das pequenas empresas...', 'Tecnologia', NOW() - INTERVAL '3 days');