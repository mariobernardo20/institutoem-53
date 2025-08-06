-- Inserir usuário admin na tabela admin_users
INSERT INTO admin_users (user_id, role, status, created_at)
SELECT 
  '3123de93-a0c4-472f-819f-459ec678b469'::uuid as user_id,
  'super_admin' as role,
  'active' as status,
  now() as created_at
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE user_id = '3123de93-a0c4-472f-819f-459ec678b469'::uuid
);