import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Radio, Newspaper, FileText, BarChart3, LogOut, Shield, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NewsAdmin } from "@/components/NewsAdmin";
import { AdminManagement } from "@/components/AdminManagement";
import { RadioTeamManagement } from "@/components/RadioTeamManagement";
import { CandidatesManagement } from "@/components/CandidatesManagement";
import { SystemSettings } from "@/components/SystemSettings";
import { RadioProgramManagement } from "@/components/RadioProgramManagement";
import JobsManagement from "@/components/JobsManagement";
import ScholarshipsManagement from "@/components/ScholarshipsManagement";
import ContactManagement from "@/components/ContactManagement";
import RadioPollsManagement from "@/components/RadioPollsManagement";
import RadioCommentsManagement from "@/components/RadioCommentsManagement";
import AdminUsersManagement from "@/components/AdminUsersManagement";

interface StatsData {
  candidatesCount: number;
  newsCount: number;
  serviceRequestsCount: number;
  pendingRequestsCount: number;
  radioProgramsCount: number;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<StatsData>({
    candidatesCount: 0,
    newsCount: 0,
    serviceRequestsCount: 0,
    pendingRequestsCount: 0,
    radioProgramsCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Verificando status de admin para usuário:', user.id);
        
        // Check if user exists in admin_users table with active status
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('role, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        console.log('Resultado da verificação admin:', { adminUser, error });

        if (error || !adminUser) {
          console.log('Usuário não é admin');
          setIsAdmin(false);
        } else {
          console.log('Usuário é admin:', adminUser.role);
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  // Fetch admin data
  useEffect(() => {
    if (isAdmin === true) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      console.log('Carregando dados do painel admin...');
      
      // Fetch stats from real database
      const [candidatesResult, newsResult, radioProgramsResult] = await Promise.all([
        supabase.from('candidates').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('radio_programs').select('id', { count: 'exact' })
      ]);

      setStats({
        candidatesCount: candidatesResult.count || 0,
        newsCount: newsResult.count || 0,
        serviceRequestsCount: 0,
        pendingRequestsCount: 0,
        radioProgramsCount: radioProgramsResult.count || 0
      });

      console.log('Dados carregados:', {
        candidates: candidatesResult.count,
        news: newsResult.count,
        radioPrograms: radioProgramsResult.count
      });
    } catch (error) {
      console.error('Erro ao carregar dados do painel:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do painel",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/admin-login");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || isAdmin === false) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Painel Administrativo</h1>
                <p className="text-muted-foreground">Instituto Empreendedor - Gestão Completa</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Logado como:</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Candidatos</p>
                  <p className="text-2xl font-bold">{stats.candidatesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Newspaper className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notícias</p>
                  <p className="text-2xl font-bold">{stats.newsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Solicitações</p>
                  <p className="text-2xl font-bold">{stats.serviceRequestsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendingRequestsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Radio className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Programas</p>
                  <p className="text-2xl font-bold">{stats.radioProgramsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="admin-users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="admin-users">
              <Shield className="h-4 w-4 mr-1" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="candidates">Candidatos</TabsTrigger>
            <TabsTrigger value="jobs">Vagas</TabsTrigger>
            <TabsTrigger value="scholarships">Bolsas</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="radio-team">Equipa Rádio</TabsTrigger>
            <TabsTrigger value="radio-programs">Programação</TabsTrigger>
            <TabsTrigger value="radio-polls">Enquetes</TabsTrigger>
            <TabsTrigger value="radio-comments">Comentários</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Admin Users Management - Default Tab */}
          <TabsContent value="admin-users">
            <AdminUsersManagement />
          </TabsContent>

          {/* Candidates Management */}
          <TabsContent value="candidates">
            <CandidatesManagement />
          </TabsContent>

          {/* Jobs Management */}
          <TabsContent value="jobs">
            <JobsManagement />
          </TabsContent>

          {/* Scholarships Management */}
          <TabsContent value="scholarships">
            <ScholarshipsManagement />
          </TabsContent>

          {/* Contact Management */}
          <TabsContent value="contact">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Notícias de Imigração e Direito</CardTitle>
              </CardHeader>
              <CardContent>
                <NewsAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radio-team">
            <RadioTeamManagement />
          </TabsContent>

          <TabsContent value="radio-programs">
            <RadioProgramManagement />
          </TabsContent>

          <TabsContent value="radio-polls">
            <RadioPollsManagement />
          </TabsContent>

          <TabsContent value="radio-comments">
            <RadioCommentsManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;