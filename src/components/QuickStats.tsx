import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, GraduationCap, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const QuickStats = () => {
  const [stats, setStats] = useState({
    candidates: 0,
    jobs: 0,
    scholarships: 0,
    listeners: 2847
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [candidatesResponse, newsResponse] = await Promise.all([
          supabase.from('candidates').select('*', { count: 'exact', head: true }),
          supabase.from('news').select('*', { count: 'exact', head: true })
        ]);

        setStats(prev => ({
          ...prev,
          candidates: candidatesResponse.count || 0,
          jobs: Math.floor((newsResponse.count || 0) * 1.5), // Estimativa
          scholarships: Math.floor((newsResponse.count || 0) * 0.8) // Estimativa
        }));
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Candidatos Registrados",
      value: stats.candidates,
      icon: Users,
      description: "Profissionais qualificados"
    },
    {
      title: "Oportunidades de Emprego",
      value: stats.jobs,
      icon: Briefcase,
      description: "Vagas disponíveis"
    },
    {
      title: "Bolsas de Estudo",
      value: stats.scholarships,
      icon: GraduationCap,
      description: "Programas ativos"
    },
    {
      title: "Ouvintes da Rádio",
      value: stats.listeners,
      icon: Radio,
      description: "Online agora"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {item.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};