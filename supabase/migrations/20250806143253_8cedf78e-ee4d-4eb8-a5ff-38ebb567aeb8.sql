-- Inserir enquetes de demonstração
INSERT INTO public.radio_polls (title, description, options, expires_at, is_active) VALUES
('Qual o seu programa favorito?', 'Vote no seu programa de rádio preferido do Instituto Empreendedor', 
'[{"text": "Café da Manhã", "value": "cafe_manha"}, {"text": "Hora do Almoço", "value": "hora_almoco"}, {"text": "Tarde Cultural", "value": "tarde_cultural"}, {"text": "Noite de Fados", "value": "noite_fados"}]'::jsonb,
NOW() + INTERVAL '30 days', true);