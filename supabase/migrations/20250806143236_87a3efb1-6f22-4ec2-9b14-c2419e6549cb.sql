-- Inserir dados de demonstração para candidatos
INSERT INTO public.candidates (full_name, email, phone, position, experience_years, skills, status, resume_url, photo_url) VALUES
('Ana Silva', 'ana.silva@email.com', '+351 912 345 678', 'Desenvolvedor Frontend', 3, ARRAY['React', 'TypeScript', 'CSS', 'JavaScript'], 'approved', '/resume/ana-silva.pdf', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png'),
('Carlos Ferreira', 'carlos.ferreira@email.com', '+351 918 765 432', 'Gestor de Projetos', 5, ARRAY['Gestão', 'Scrum', 'Leadership', 'PMI'], 'approved', '/resume/carlos-ferreira.pdf', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png'),
('Mariana Costa', 'mariana.costa@email.com', '+351 915 555 123', 'UX/UI Designer', 4, ARRAY['Figma', 'Adobe Creative', 'User Research', 'Prototyping'], 'approved', '/resume/mariana-costa.pdf', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png'),
('Pedro Santos', 'pedro.santos@email.com', '+351 913 888 999', 'Analista de Dados', 2, ARRAY['Python', 'SQL', 'Machine Learning', 'Tableau'], 'pending', '/resume/pedro-santos.pdf', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png');

-- Inserir notícias de demonstração
INSERT INTO public.news (title, content, category, status, image_url, published_at) VALUES
('Portugal lança novo programa de apoio à imigração qualificada', 'O governo português anunciou hoje um novo programa destinado a atrair profissionais qualificados de tecnologia e engenharia para o país. O programa oferece visto de residência acelerado e benefícios fiscais.', 'Imigração', 'published', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png', NOW()),
('Oportunidades de trabalho em tecnologia crescem', 'Setor tecnológico português regista crescimento significativo na criação de empregos, com especial destaque para desenvolvimento de software e inteligência artificial.', 'Emprego', 'published', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png', NOW() - INTERVAL '1 day'),
('Nova legislação facilita reconhecimento de diplomas estrangeiros', 'Processo de reconhecimento de qualificações académicas obtidas no estrangeiro torna-se mais rápido e eficiente, beneficiando milhares de imigrantes.', 'Educação', 'published', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png', NOW() - INTERVAL '2 days'),
('Programa de bolsas para estudantes internacionais ampliado', 'Universidades portuguesas ampliam programa de bolsas destinado a estudantes de países lusófonos e da União Europeia.', 'Educação', 'published', '/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png', NOW() - INTERVAL '3 days');

-- Inserir programas de rádio de demonstração
INSERT INTO public.radio_programs (title, description, host_name, schedule_time, schedule_days, duration_minutes, is_active) VALUES
('Café da Manhã', 'Notícias e música para começar bem o dia', 'Maria João', '08:00:00', ARRAY['segunda', 'terça', 'quarta', 'quinta', 'sexta'], 120, true),
('Hora do Almoço', 'Variedades musicais e informação durante a pausa do almoço', 'António Silva', '12:00:00', ARRAY['segunda', 'terça', 'quarta', 'quinta', 'sexta'], 90, true),
('Tarde Cultural', 'Programa dedicado à cultura portuguesa e internacional', 'Sofia Mendes', '15:00:00', ARRAY['segunda', 'quarta', 'sexta'], 60, true),
('Noite de Fados', 'O melhor do fado tradicional e contemporâneo', 'João Rodrigues', '21:00:00', ARRAY['quinta', 'sexta', 'sábado'], 90, true);