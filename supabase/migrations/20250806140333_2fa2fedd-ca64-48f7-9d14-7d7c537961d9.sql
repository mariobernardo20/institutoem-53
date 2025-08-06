-- Inserir o usuário atual como admin
INSERT INTO admin_users (user_id, email, full_name, role, status, created_by)
VALUES (
  'd16e06dc-09db-4861-8e83-a2ec6da08f14',
  'rb9356670@gmail.com',
  'Administrador',
  'super_admin',
  'active',
  'd16e06dc-09db-4861-8e83-a2ec6da08f14'
) ON CONFLICT (user_id) DO UPDATE SET
  status = 'active',
  role = 'super_admin';