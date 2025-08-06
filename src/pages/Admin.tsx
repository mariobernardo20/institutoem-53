import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Radio, Newspaper, FileText, BarChart3, Settings, LogOut, Briefcase, GraduationCap, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface ServiceRequest {
  id: string;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  description: string;
  status: string;
  requested_at: string;
}

interface StatsData {
  candidatesCount: number;
  newsCount: number;
  serviceRequestsCount: number;
  pendingRequestsCount: number;
  radioProgramsCount: number;
}

const Admin = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<StatsData>({
    candidatesCount: 0,
    newsCount: 0,
    serviceRequestsCount: 0,
    pendingRequestsCount: 0,
    radioProgramsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch service requests
      const { data: requests } = await supabase
        .from('service_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      // Fetch stats
      const [candidatesResult, newsResult, radioProgramsResult] = await Promise.all([
        supabase.from('candidates').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('radio_programs').select('id', { count: 'exact' })
      ]);

      const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;

      setServiceRequests(requests || []);
      setStats({
        candidatesCount: candidatesResult.count || 0,
        newsCount: newsResult.count || 0,
        serviceRequestsCount: requests?.length || 0,
        pendingRequestsCount: pendingRequests,
        radioProgramsCount: radioProgramsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do painel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      setServiceRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      toast({
        title: "Sucesso",
        description: "Status da solicitação atualizado",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "default" as const },
      in_progress: { label: "Em Andamento", variant: "secondary" as const },
      completed: { label: "Concluído", variant: "default" as const },
      rejected: { label: "Rejeitado", variant: "destructive" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">Carregando painel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gestão do Instituto Empreendedor</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/auth';
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
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
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="requests">Solicitações</TabsTrigger>
            <TabsTrigger value="candidates">Candidatos</TabsTrigger>
            <TabsTrigger value="jobs">Vagas</TabsTrigger>
            <TabsTrigger value="scholarships">Bolsas</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="radio-team">Equipa Rádio</TabsTrigger>
            <TabsTrigger value="radio-programs">Programação</TabsTrigger>
            <TabsTrigger value="radio-polls">Enquetes</TabsTrigger>
            <TabsTrigger value="radio-comments">Comentários</TabsTrigger>
            <TabsTrigger value="admins">Administradores</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Service Requests */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{request.service_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.client_name} • {request.client_email}
                          </p>
                          {request.client_phone && (
                            <p className="text-sm text-muted-foreground">{request.client_phone}</p>
                          )}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <p className="text-sm mb-4">{request.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateRequestStatus(request.id, 'in_progress')}
                          disabled={request.status !== 'pending'}
                        >
                          Aceitar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateRequestStatus(request.id, 'completed')}
                          disabled={request.status === 'completed' || request.status === 'rejected'}
                        >
                          Concluir
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                          disabled={request.status === 'completed' || request.status === 'rejected'}
                        >
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {serviceRequests.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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

          <TabsContent value="admins">
            <AdminManagement />
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
