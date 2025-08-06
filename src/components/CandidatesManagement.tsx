import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Edit, Trash2, Eye, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCandidates, type Candidate } from "@/hooks/useCandidates";

export const CandidatesManagement = () => {
  const { candidates, loading, updateCandidate, reload } = useCandidates();
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId);

      if (error) throw error;

      // Recarregar dados para sincronizar
      await reload();
      
      toast({
        title: "Sucesso",
        description: "Candidato removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover candidato",
        variant: "destructive"
      });
    }
  };

  const handleEditCandidate = async (candidateData: Partial<Candidate>) => {
    if (!editingCandidate) return;

    const success = await updateCandidate(editingCandidate.id, candidateData);
    
    if (success) {
      setIsEditDialogOpen(false);
      setEditingCandidate(null);
      // Recarregar para garantir sincronização
      await reload();
    }
  };

  const EditCandidateForm = ({ candidate }: { candidate: Candidate }) => {
    const [formData, setFormData] = useState({
      name: candidate.name,
      area: candidate.area,
      experience_years: candidate.experience_years,
      email: candidate.email || '',
      phone: candidate.phone || '',
      description: candidate.description || '',
      skills: candidate.skills.join(', ')
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleEditCandidate({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      });
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
          placeholder="Área de atuação"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Anos de experiência"
          value={formData.experience_years}
          onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          placeholder="Telefone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Textarea
          placeholder="Descrição"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          placeholder="Competências (separadas por vírgula)"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        />
        <Button type="submit" className="w-full">
          Salvar Alterações
        </Button>
      </form>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando candidatos...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão de Candidatos
            <Badge variant="outline" className="ml-2">
              {candidates.length} {candidates.length === 1 ? 'Candidato' : 'Candidatos'}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <Badge variant="outline">{candidate.area}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {candidate.experience_years} {candidate.experience_years === 1 ? 'ano' : 'anos'} de experiência
                    </p>
                    {candidate.email && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{candidate.email}</span>
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    {candidate.description && (
                      <p className="text-sm text-muted-foreground max-w-md line-clamp-2">
                        {candidate.description}
                      </p>
                    )}
                    {candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`/candidato/${candidate.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCandidate(candidate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Candidato</DialogTitle>
                      </DialogHeader>
                      {editingCandidate && <EditCandidateForm candidate={editingCandidate} />}
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
                          Tem certeza que deseja remover o candidato "{candidate.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCandidate(candidate.id)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}

          {candidates.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum candidato cadastrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};