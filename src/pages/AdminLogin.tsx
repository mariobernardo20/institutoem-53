import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Shield, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  // Login form data
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // Redirect if user is already logged in and is admin
    if (user && isAdmin) {
      navigate("/admin");
    } else if (user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou senha incorretos");
        }
      } else if (data.user) {
        console.log('Login bem-sucedido para usuário:', data.user.id);
        
        // Check if user is admin by fetching admin_users table
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('role, status')
          .eq('user_id', data.user.id)
          .eq('status', 'active')
          .single();

        console.log('Verificação admin:', { adminUser, adminError });

        if (adminError || !adminUser) {
          console.log('Usuário não é admin ou erro:', adminError);
          await supabase.auth.signOut();
          setError("Acesso negado. Este login é apenas para administradores.");
        } else {
          console.log('Admin verificado, redirecionando...');
          
          // Log the successful admin login
          try {
            await supabase.rpc('log_admin_action', {
              p_action: 'admin_login_success',
              p_target_type: 'auth',
              p_target_id: data.user.id,
              p_details: { email: data.user.email, role: adminUser.role }
            });
          } catch (logError) {
            console.warn('Erro ao registrar log de login:', logError);
          }

          // Successful admin login - redirect immediately
          setSuccess("Login realizado com sucesso! Redirecionando...");
          // Immediate redirect without delay
          navigate("/admin");
        }
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { error, data } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-login`,
          data: {
            full_name: registerData.fullName,
            role: 'admin'
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setError("Este email já está cadastrado");
        } else {
          setError(error.message);
        }
      } else if (data.user) {
        try {
          // Inserir nos dois locais para consistência
          
          // 1. Criar perfil na tabela profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              email: registerData.email,
              full_name: registerData.fullName,
              role: 'admin'
            });

          if (profileError) {
            console.warn('Erro ao criar perfil:', profileError);
          }

          // 2. Criar entrada na tabela admin_users (mais importante)
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
              user_id: data.user.id,
              email: registerData.email,
              full_name: registerData.fullName,
              role: 'admin',
              status: 'active'
            });

          if (adminError) {
            console.error('Erro crítico ao criar admin_user:', adminError);
            setError(`Erro ao criar usuário administrativo: ${adminError.message}`);
          } else {
            setSuccess("Conta administrativa criada com sucesso! Você já pode fazer login.");
            setRegisterData({
              fullName: "",
              email: "",
              password: "",
              confirmPassword: ""
            });
          }
        } catch (err) {
          console.error('Erro ao criar registros admin:', err);
          setError("Erro ao configurar permissões administrativas");
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Criar Conta
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email do Administrador</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    disabled={loading}
                    placeholder="Digite seu email administrativo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    disabled={loading}
                    placeholder="Digite sua senha"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verificando..." : "Entrar como Admin"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-fullName">Nome Completo</Label>
                  <Input
                    id="register-fullName"
                    name="fullName"
                    type="text"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    required
                    disabled={loading}
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    disabled={loading}
                    placeholder="Digite seu email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    disabled={loading}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="register-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    disabled={loading}
                    placeholder="Digite a senha novamente"
                  />
                </div>


                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar Conta Admin"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

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

          {success && (
            <Alert className="mt-4">
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

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