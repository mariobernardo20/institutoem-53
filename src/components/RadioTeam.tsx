import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Calendar } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  program: string;
  schedule_time: string;
  bio: string;
  status: 'online' | 'offline' | 'recording';
}

export const RadioTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadTeamData();
    
    // Update team data every 10 seconds to reflect changes from admin panel
    const interval = setInterval(loadTeamData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadTeamData = () => {
    try {
      const storedMembers = localStorage.getItem('radio_team_members');
      if (storedMembers) {
        setTeam(JSON.parse(storedMembers));
      } else {
        // Initialize with default data if none exists - but use different names for public page
        const defaultTeam: TeamMember[] = [
          {
            id: '1',
            name: "Carlos Mendes",
            role: "Fundador & Diretor",
            program: "Café com Empreendedores",
            schedule_time: "06:00 - 08:00",
            bio: "Empreendedor há 20 anos, fundou 3 empresas de sucesso em Portugal.",
            status: "online"
          },
          {
            id: '2',
            name: "Ana Silva",
            role: "Co-fundadora",
            program: "Histórias de Sucesso",
            schedule_time: "12:00 - 14:00",
            bio: "Especialista em inovação e transformação digital.",
            status: "online"
          },
          {
            id: '3',
            name: "João Rodrigues",
            role: "Apresentador",
            program: "Dicas de Negócios",
            schedule_time: "08:00 - 12:00",
            bio: "Consultor empresarial com foco em pequenas e médias empresas.",
            status: "recording"
          },
          {
            id: '4',
            name: "Maria Santos",
            role: "Apresentadora",
            program: "Tendências do Mercado",
            schedule_time: "14:00 - 16:00",
            bio: "Analista de mercado e especialista em investimentos.",
            status: "offline"
          }
        ];
        setTeam(defaultTeam);
        localStorage.setItem('radio_team_members', JSON.stringify(defaultTeam));
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recording":
        return "bg-red-500";
      case "online":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "recording":
        return "NO AR";
      case "online":
        return "ONLINE";
      default:
        return "OFFLINE";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Equipa da Rádio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {team.map((member, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(member.status)} rounded-full border-2 border-white flex items-center justify-center`}>
                  {member.status === "recording" && <Mic className="h-2 w-2 text-white" />}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm">{member.name}</h4>
                  <Badge 
                    variant={member.status === "recording" ? "destructive" : member.status === "online" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {getStatusText(member.status)}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-1">{member.role}</p>
                <p className="text-xs text-gray-500 mb-2">{member.bio}</p>
                
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Mic className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">{member.program}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-purple-500" />
                    <span>{member.schedule_time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">
            📻 Rádio Instituto Empreendedor - Fundada em 2020
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Inspirando empreendedores em Portugal e no mundo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};