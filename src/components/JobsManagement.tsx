import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Briefcase, MapPin, Euro, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  category: string;
  experience_level: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const JobsManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "full-time",
    description: "",
    requirements: "",
    benefits: "",
    category: "",
    experience_level: "junior",
    status: "active" as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Simular dados para demonstração
      const mockJobs: Job[] = [
        {
          id: "1",
          title: "Desenvolvedor Full Stack",
          company: "Tech Solutions",
          location: "Lisboa",
          salary: "€35.000 - €45.000",
          type: "full-time",
          description: "Procuramos desenvolvedor experiente",
          requirements: ["React", "Node.js", "TypeScript"],
          benefits: ["Seguro saúde", "Horário flexível"],
          category: "Tecnologia",
          experience_level: "senior",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setJobs(mockJobs);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar vagas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        benefits: formData.benefits ? formData.benefits.split('\n').filter(ben => ben.trim()) : []
      };

      // Simular salvamento
      toast({
        title: "Sucesso",
        description: editingJob ? "Vaga atualizada com sucesso!" : "Nova vaga criada com sucesso!"
      });

      resetForm();
      fetchJobs();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar vaga",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || "",
      type: job.type,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : "",
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : "",
      category: job.category,
      experience_level: job.experience_level,
      status: job.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;

    try {
      // Simular exclusão
      toast({
        title: "Sucesso",
        description: "Vaga excluída com sucesso!"
      });
      
      fetchJobs();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir vaga",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      salary: "",
      type: "full-time",
      description: "",
      requirements: "",
      benefits: "",
      category: "",
      experience_level: "junior",
      status: "active"
    });
    setEditingJob(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return <div className="text-center">Carregando vagas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Vagas de Emprego</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? 'Editar Vaga' : 'Nova Vaga de Emprego'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Localização *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salário</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="ex: €30.000 - €40.000"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Vaga *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Tempo Integral</SelectItem>
                      <SelectItem value="part-time">Meio Tempo</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Estágio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    placeholder="ex: Tecnologia, Marketing..."
                  />
                </div>
                <div>
                  <Label htmlFor="experience_level">Nível de Experiência *</Label>
                  <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Júnior</SelectItem>
                      <SelectItem value="pleno">Pleno</SelectItem>
                      <SelectItem value="senior">Sénior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição da Vaga *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requisitos (um por linha) *</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  required
                  rows={4}
                  placeholder="Experiência com React&#10;Conhecimento em TypeScript&#10;Inglês fluente"
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  rows={3}
                  placeholder="Seguro de saúde&#10;Horário flexível&#10;Trabalho remoto"
                />
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

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingJob ? 'Atualizar Vaga' : 'Criar Vaga'}
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
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                    {job.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(job)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(job.created_at)}</span>
                </div>
                <Badge variant="outline">{job.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            </CardContent>
          </Card>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma vaga cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsManagement;