import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Radio, Users, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RadioTeamMember {
  id: string;
  name: string;
  role: string;
  program: string;
  schedule_time: string;
  bio: string;
  status: 'online' | 'offline' | 'recording';
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const RadioTeamManagement = () => {
  const [members, setMembers] = useState<RadioTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<RadioTeamMember | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Try to get from localStorage first for compatibility
      const storedMembers = localStorage.getItem('radio_team_members');
      if (storedMembers) {
        const localMembers = JSON.parse(storedMembers);
        setMembers(localMembers);
        // Migrate to localStorage since we don't have radio_team_members table yet
      } else {
        // Initialize with default team data
        const defaultMembers: RadioTeamMember[] = [
          {
            id: '1',
            name: 'João Silva',
            role: 'Diretor da Rádio',
            program: 'Manhã Informativa',
            schedule_time: '06:00-10:00',
            bio: 'Jornalista com 15 anos de experiência em comunicação.',
            status: 'offline'
          },
          {
            id: '2',
            name: 'Maria Santos',
            role: 'Apresentadora',
            program: 'Tarde Musical',
            schedule_time: '14:00-18:00',
            bio: 'Especialista em música portuguesa e internacional.',
            status: 'online'
          },
          {
            id: '3',
            name: 'Pedro Costa',
            role: 'Locutor',
            program: 'Noite Jovem',
            schedule_time: '20:00-24:00',
            bio: 'DJ e produtor musical, trazendo as novidades da música.',
            status: 'recording'
          }
        ];
        setMembers(defaultMembers);
        localStorage.setItem('radio_team_members', JSON.stringify(defaultMembers));
      }
    } catch (error) {
      console.error('Error loading members:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar equipe da rádio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData: Omit<RadioTeamMember, 'id'>) => {
    try {
      const newMember: RadioTeamMember = {
        ...memberData,
        id: Date.now().toString(), // Simple ID generation for localStorage
      };

      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
      localStorage.setItem('radio_team_members', JSON.stringify(updatedMembers));
      
      setIsAddDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Membro adicionado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar membro",
        variant: "destructive"
      });
    }
  };

  const handleEditMember = async (memberData: Partial<RadioTeamMember>) => {
    if (!editingMember) return;

    try {
      const updatedMembers = members.map(member =>
        member.id === editingMember.id ? { ...member, ...memberData } : member
      );
      setMembers(updatedMembers);
      localStorage.setItem('radio_team_members', JSON.stringify(updatedMembers));
      
      setIsEditDialogOpen(false);
      setEditingMember(null);
      toast({
        title: "Sucesso",
        description: "Membro atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar membro",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const updatedMembers = members.filter(member => member.id !== memberId);
      setMembers(updatedMembers);
      localStorage.setItem('radio_team_members', JSON.stringify(updatedMembers));
      
      toast({
        title: "Sucesso",
        description: "Membro removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover membro",
        variant: "destructive"
      });
    }
  };

  const updateMemberStatus = (memberId: string, newStatus: 'online' | 'offline' | 'recording') => {
    const updatedMembers = members.map(member =>
      member.id === memberId ? { ...member, status: newStatus } : member
    );
    setMembers(updatedMembers);
    localStorage.setItem('radio_team_members', JSON.stringify(updatedMembers));
    
    toast({
      title: "Sucesso",
      description: "Status do membro atualizado",
    });
  };

  const MemberForm = ({ member, onSubmit }: { 
    member?: RadioTeamMember; 
    onSubmit: (data: Omit<RadioTeamMember, 'id'> | Partial<RadioTeamMember>) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: member?.name || '',
      role: member?.role || '',
      program: member?.program || '',
      schedule_time: member?.schedule_time || '',
      bio: member?.bio || '',
      status: member?.status || 'offline' as const
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          placeholder="Função"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
        <Input
          placeholder="Programa"
          value={formData.program}
          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
          required
        />
        <Input
          placeholder="Horário (ex: 08:00-12:00)"
          value={formData.schedule_time}
          onChange={(e) => setFormData({ ...formData, schedule_time: e.target.value })}
          required
        />
        <Textarea
          placeholder="Biografia"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
        />
        <Button type="submit" className="w-full">
          {member ? 'Salvar Alterações' : 'Adicionar Membro'}
        </Button>
      </form>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      online: { label: "Online", color: "bg-green-100 text-green-800" },
      offline: { label: "Offline", color: "bg-gray-100 text-gray-800" },
      recording: { label: "No Ar", color: "bg-red-100 text-red-800" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando equipe...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Gestão da Equipe da Rádio
            <Badge variant="outline" className="ml-2">
              {members.length} {members.length === 1 ? 'Membro' : 'Membros'}
            </Badge>
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
              </DialogHeader>
              <MemberForm onSubmit={handleAddMember} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>Sistema temporário - Dados salvos localmente. Em breve com banco de dados completo.</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.program && (
                      <p className="text-sm text-primary font-medium">{member.program}</p>
                    )}
                    {member.schedule_time && (
                      <p className="text-xs text-muted-foreground">{member.schedule_time}</p>
                    )}
                    {member.bio && (
                      <p className="text-xs text-muted-foreground max-w-md">{member.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant={member.status === 'online' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => updateMemberStatus(member.id, 'online')}
                    >
                      Online
                    </Button>
                    <Button 
                      variant={member.status === 'recording' ? 'destructive' : 'outline'} 
                      size="sm"
                      onClick={() => updateMemberStatus(member.id, 'recording')}
                    >
                      No Ar
                    </Button>
                    <Button 
                      variant={member.status === 'offline' ? 'secondary' : 'outline'} 
                      size="sm"
                      onClick={() => updateMemberStatus(member.id, 'offline')}
                    >
                      Offline
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Membro</DialogTitle>
                        </DialogHeader>
                        {editingMember && <MemberForm member={editingMember} onSubmit={handleEditMember} />}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover "{member.name}" da equipe? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum membro na equipe da rádio</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};