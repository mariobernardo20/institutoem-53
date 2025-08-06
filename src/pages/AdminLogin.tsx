import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    // Redirect if user is already logged in and is admin
    if (user && isAdmin) {
      navigate("/admin");
    } else if (user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou senha incorretos");
        } else {
          setError(error.message);
        }
      } else if (data.user) {
        // Check if user is admin by fetching profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          setError("Erro ao verificar permissões");
        } else if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
          await supabase.auth.signOut();
          setError("Acesso negado. Este login é apenas para administradores.");
        } else {
          navigate("/admin");
        }
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png" 
              alt="Instituto Empreendedor" 
              className="h-16 object-contain" 
            />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Login Administrativo
          </CardTitle>
          <CardDescription>
            Acesso restrito para administradores
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Administrador</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Digite seu email administrativo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Digite sua senha"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Entrar como Admin"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Voltar para página principal
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Login normal de usuário
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              Este acesso é restrito a administradores autorizados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;