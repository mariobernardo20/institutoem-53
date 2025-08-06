import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  role: 'admin' | 'super_admin';
  invitedByName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { email, role, invitedByName }: InviteRequest = await req.json();

    // Generate secure invitation token
    const invitationToken = crypto.randomUUID();
    
    // Create invitation record
    const { data: invitation, error: insertError } = await supabaseClient
      .from('admin_invitations')
      .insert({
        email,
        role,
        invitation_token: invitationToken,
        invited_by: (await supabaseClient.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send invitation email
    const inviteUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/admin-accept-invite?token=${invitationToken}`;
    
    const emailResponse = await resend.emails.send({
      from: "Admin Portal <onboarding@resend.dev>",
      to: [email],
      subject: "Convite para Administrador - Portal Administrativo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Convite para Administrador</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">Olá,</p>
            <p>Você foi convidado por <strong>${invitedByName}</strong> para ser um ${role === 'super_admin' ? 'Super Administrador' : 'Administrador'} do portal administrativo.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Aceitar Convite
            </a>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Importante:</strong> Este convite expira em 48 horas.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            Se você não esperava este convite, pode ignorar este email com segurança.
          </p>
        </div>
      `,
    });

    console.log("Invitation email sent:", emailResponse);

    // Log admin action
    await supabaseClient.rpc('log_admin_action', {
      p_action: 'admin_invite_sent',
      p_target_type: 'admin_invitation',
      p_target_id: invitation.id,
      p_details: { email, role }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Convite enviado com sucesso!",
      invitationId: invitation.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in send-admin-invite function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);