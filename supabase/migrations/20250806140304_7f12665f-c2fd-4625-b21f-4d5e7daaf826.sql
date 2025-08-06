-- Inserir o usuário atual como admin
INSERT INTO admin_users (user_id, role, status, invited_by, invited_at, accepted_at)
VALUES (
  'd16e06dc-09db-4861-8e83-a2ec6da08f14',
  'super_admin',
  'active',
  'd16e06dc-09db-4861-8e83-a2ec6da08f14',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  status = 'active',
  role = 'super_admin';