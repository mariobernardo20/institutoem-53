import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, User, Briefcase, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CandidateProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  position?: string;
  experience_years?: number;
  skills?: string[];
  status?: string;
  created_at: string;
  description?: string;
}

export const CandidateDashboard = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Demo profile for Carlos Ferreira
        const demoProfile: CandidateProfile = {
          id: 'demo-1',
          full_name: 'Carlos Ferreira',
          email: 'carlos.ferreira@email.com',
          phone: '+351 918 765 432',
          position: 'Gestor de Projetos',
          experience_years: 5,
          skills: ['Gestão', 'Scrum', 'Leadership', 'PMI'],
          status: 'approved',
          created_at: '2025-08-06T00:00:00Z',
          description: '5 anos de experiência em gestão de projetos, especializado em metodologias ágeis e liderança de equipas.'
        };
        setProfile(demoProfile);
        setLoading(false);
        return;
      }

      // Try to find candidate profile
      const { data: candidate, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (candidate) {
        setProfile({
          ...candidate,
          description: candidate.position ? `${candidate.experience_years} anos de experiência em ${candidate.position}` : undefined
        });
      } else {
        // No candidate profile found, redirect to create one
        toast({
          title: "Perfil não encontrado",
          description: "Você precisa criar um perfil de candidato primeiro",
          variant: "destructive"
        });
        navigate('/candidates');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar perfil do candidato",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center">Carregando perfil...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="mb-4">Perfil não encontrado</p>
              <Button onClick={handleLogout}>Voltar à página principal</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar à página principal
          </Button>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            Sair
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {profile.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-lg text-muted-foreground mb-2">
                  <Briefcase className="h-5 w-5" />
                  <span>{profile.position}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{profile.experience_years} anos de experiência</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sobre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.description || `Profissional com ${profile.experience_years} anos de experiência na área de ${profile.position}.`}
                </p>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Competências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhuma competência registrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Registrado em</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Editar Perfil
                </Button>
                <Button className="w-full" variant="outline">
                  Ver Candidaturas
                </Button>
                <Button className="w-full" variant="outline">
                  Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};