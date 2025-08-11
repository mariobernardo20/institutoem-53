import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export const JobApplicationDialog = ({ 
  open, 
  onOpenChange, 
  jobId, 
  jobTitle, 
  companyName 
}: JobApplicationDialogProps) => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // For now, we'll simulate upload since we don't have storage bucket
        // In real implementation, you would upload to Supabase Storage
        resumeUrl = `resume-${fileName}`;
      }

      // Submit application (save to localStorage for now)
      const application = {
        id: Date.now().toString(),
        job_id: jobId,
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone,
        cover_letter: formData.cover_letter,
        resume_url: resumeUrl,
        status: 'pending',
        applied_at: new Date().toISOString()
      };

      // Save to localStorage
      const existingApplications = JSON.parse(localStorage.getItem('job_applications') || '[]');
      existingApplications.push(application);
      localStorage.setItem('job_applications', JSON.stringify(existingApplications));

      toast({
        title: "Sucesso!",
        description: "Candidatura enviada com sucesso. Entraremos em contato em breve.",
      });

      // Reset form
      setFormData({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: ''
      });
      setResumeFile(null);
      onOpenChange(false);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar candidatura. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Candidatar-se para {jobTitle}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {companyName}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.applicant_name}
                onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                required
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.applicant_email}
                onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                required
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.applicant_phone}
              onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
              placeholder="+351 xxx xxx xxx"
            />
          </div>

          <div>
            <Label htmlFor="resume">Currículo (PDF, DOC, DOCX - Max 5MB)</Label>
            <div className="mt-2">
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {resumeFile ? resumeFile.name : "Clique para selecionar arquivo"}
                  </p>
                </div>
              </label>
              {resumeFile && (
                <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{resumeFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setResumeFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="cover_letter">Carta de Apresentação *</Label>
            <Textarea
              id="cover_letter"
              value={formData.cover_letter}
              onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
              required
              rows={6}
              placeholder="Conte-nos sobre você, sua experiência e por que está interessado nesta posição..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Candidatura"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};