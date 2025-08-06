-- Create admin invitations table
CREATE TABLE public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, expired, cancelled
  invitation_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin audit logs table
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT, -- 'user', 'news', 'candidate', etc.
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create login attempts table for security
CREATE TABLE public.admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Super admins can manage invitations" 
ON public.admin_invitations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'super_admin'
));

CREATE POLICY "Admins can view their own audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (admin_id = auth.uid());

CREATE POLICY "Super admins can view all audit logs" 
ON public.admin_audit_logs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'super_admin'
));

CREATE POLICY "Super admins can view login attempts" 
ON public.admin_login_attempts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'super_admin'
));

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Create function to record login attempts
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  p_email TEXT,
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_id UUID;
BEGIN
  INSERT INTO admin_login_attempts (email, success, failure_reason)
  VALUES (p_email, p_success, p_failure_reason)
  RETURNING id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_invitations_updated_at
  BEFORE UPDATE ON public.admin_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX idx_admin_invitations_token ON public.admin_invitations(invitation_token);
CREATE INDEX idx_admin_invitations_status ON public.admin_invitations(status);
CREATE INDEX idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX idx_admin_login_attempts_email ON public.admin_login_attempts(email);
CREATE INDEX idx_admin_login_attempts_created_at ON public.admin_login_attempts(created_at);