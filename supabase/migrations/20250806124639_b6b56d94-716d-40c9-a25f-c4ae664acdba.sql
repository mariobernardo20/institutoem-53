-- Atualizar a senha do usuário admin para 787525
-- Primeiro verificamos se o usuário existe e então atualizamos a senha
UPDATE auth.users 
SET encrypted_password = crypt('787525', gen_salt('bf'))
WHERE email = 'sweetwish493@gmail.com' AND id = '3123de93-a0c4-472f-819f-459ec678b469';