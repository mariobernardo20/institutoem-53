import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Shield } from "lucide-react";

const AdminAcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [token] = useState(searchParams.get("token"));
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  useEffect(() => {
    if (!token) {
      toast({
        title: "Erro",
        description: "Token de convite inválido",
        variant: "destructive",
      });
      navigate("/admin-login");
      return;
    }

    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_invitations")
        .select("*")
        .eq("invitation_token", token)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "Erro",
          description: "Convite inválido ou expirado",
          variant: "destructive",
        });
        navigate("/admin-login");
        return;
      }

      setInvitation(data);
      setFormData({ ...formData, email: data.email });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao validar convite: " + error.message,
        variant: "destructive",
      });
      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('accept-admin-invite', {
        body: {
          token,
          userData: {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso! Redirecionando para o login...",
      });

      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao criar conta: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Validando convite...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Aceitar Convite de Administrador
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete seu cadastro para acessar o portal administrativo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Criar Conta de Administrador
            </CardTitle>
            {invitation && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Você foi convidado para ser um{" "}
                  <strong>
                    {invitation.role === 'super_admin' ? 'Super Administrador' : 'Administrador'}
                  </strong>{" "}
                  do sistema.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirme sua senha"
                  required
                  minLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitting}
              >
                {submitting ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAcceptInvite;