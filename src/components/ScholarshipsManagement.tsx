import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GraduationCap, Euro, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  description: string;
  eligibility: string[];
  level: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const ScholarshipsManagement = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    amount: "",
    deadline: "",
    category: "",
    description: "",
    eligibility: "",
    level: "undergraduate",
    status: "active" as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      // Simular dados para demonstração
      const mockScholarships: Scholarship[] = [
        {
          id: "1",
          title: "Bolsa de Mérito Académico",
          provider: "Fundação para a Ciência",
          amount: "€5.000/ano",
          deadline: "31 de Março, 2024",
          category: "Ciências",
          description: "Bolsa para estudantes com excelente desempenho",
          eligibility: ["Média superior a 16", "Estudante português"],
          level: "undergraduate",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setScholarships(mockScholarships);
    } catch (error) {
      console.error('Erro ao buscar bolsas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar bolsas de estudo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const scholarshipData = {
        ...formData,
        eligibility: formData.eligibility.split('\n').filter(req => req.trim())
      };

      // Simular salvamento
      toast({
        title: "Sucesso",
        description: editingScholarship ? "Bolsa atualizada com sucesso!" : "Nova bolsa criada com sucesso!"
      });

      resetForm();
      fetchScholarships();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar bolsa",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      title: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount,
      deadline: scholarship.deadline,
      category: scholarship.category,
      description: scholarship.description,
      eligibility: Array.isArray(scholarship.eligibility) ? scholarship.eligibility.join('\n') : "",
      level: scholarship.level,
      status: scholarship.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (scholarshipId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta bolsa?')) return;

    try {
      // Simular exclusão
      toast({
        title: "Sucesso",
        description: "Bolsa excluída com sucesso!"
      });
      
      fetchScholarships();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir bolsa",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      provider: "",
      amount: "",
      deadline: "",
      category: "",
      description: "",
      eligibility: "",
      level: "undergraduate",
      status: "active"
    });
    setEditingScholarship(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      'undergraduate': 'Licenciatura',
      'graduate': 'Mestrado',
      'phd': 'Doutoramento',
      'vocational': 'Profissional'
    };
    return levels[level] || level;
  };

  if (loading) {
    return <div className="text-center">Carregando bolsas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Bolsas de Estudo</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Bolsa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingScholarship ? 'Editar Bolsa' : 'Nova Bolsa de Estudo'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título da Bolsa *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="provider">Provedor/Instituição *</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Valor *</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="ex: €5.000/ano"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Prazo *</Label>
                  <Input
                    id="deadline"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                    placeholder="ex: 31 de Março, 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    placeholder="ex: Ciências, Mobilidade..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="level">Nível de Ensino *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Licenciatura</SelectItem>
                      <SelectItem value="graduate">Mestrado</SelectItem>
                      <SelectItem value="phd">Doutoramento</SelectItem>
                      <SelectItem value="vocational">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição da Bolsa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="eligibility">Critérios de Elegibilidade (um por linha) *</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                  required
                  rows={4}
                  placeholder="Média superior a 16 valores&#10;Estudante em instituição portuguesa&#10;Área STEM"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingScholarship ? 'Atualizar Bolsa' : 'Criar Bolsa'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                    <p className="text-muted-foreground">{scholarship.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={scholarship.status === 'active' ? 'default' : 'secondary'}>
                    {scholarship.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(scholarship)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(scholarship.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{scholarship.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{getLevelLabel(scholarship.level)}</span>
                </div>
                <Badge variant="outline">{scholarship.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{scholarship.description}</p>
            </CardContent>
          </Card>
        ))}

        {scholarships.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma bolsa cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsManagement;