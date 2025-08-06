import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AcceptInviteRequest {
  token: string;
  userData: {
    email: string;
    password: string;
    fullName: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { token, userData }: AcceptInviteRequest = await req.json();

    // Find and validate invitation
    const { data: invitation, error: inviteError } = await supabaseClient
      .from('admin_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteError || !invitation) {
      return new Response(JSON.stringify({ 
        error: "Convite inválido ou expirado" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create user account
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: {
        full_name: userData.fullName,
        role: invitation.role
      },
      email_confirm: true
    });

    if (authError || !authUser.user) {
      console.error('Error creating user:', authError);
      return new Response(JSON.stringify({ 
        error: authError?.message || "Erro ao criar usuário" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create admin_users record
    const { error: adminUserError } = await supabaseClient
      .from('admin_users')
      .insert({
        user_id: authUser.user.id,
        email: userData.email,
        full_name: userData.fullName,
        role: invitation.role,
        status: 'active',
        created_by: invitation.invited_by
      });

    if (adminUserError) {
      console.error('Error creating admin user:', adminUserError);
      // Clean up auth user if admin_users creation fails
      await supabaseClient.auth.admin.deleteUser(authUser.user.id);
      return new Response(JSON.stringify({ 
        error: "Erro ao criar registro de administrador" 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update invitation status
    await supabaseClient
      .from('admin_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitation.id);

    // Send welcome email
    await resend.emails.send({
      from: "Admin Portal <onboarding@resend.dev>",
      to: [userData.email],
      subject: "Bem-vindo ao Portal Administrativo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28a745; text-align: center;">Bem-vindo!</h1>
          
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">Olá ${userData.fullName},</p>
            <p>Sua conta de administrador foi criada com sucesso!</p>
            <p><strong>Nível de acesso:</strong> ${invitation.role === 'super_admin' ? 'Super Administrador' : 'Administrador'}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/admin-login" 
               style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Acessar Portal
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            Mantenha suas credenciais seguras e não compartilhe com terceiros.
          </p>
        </div>
      `,
    });

    // Log admin action
    await supabaseClient.rpc('log_admin_action', {
      p_action: 'admin_invite_accepted',
      p_target_type: 'admin_user',
      p_target_id: authUser.user.id,
      p_details: { email: userData.email, role: invitation.role }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Conta criada com sucesso!" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in accept-admin-invite function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);