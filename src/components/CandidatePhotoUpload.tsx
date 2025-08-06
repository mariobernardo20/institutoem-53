import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCandidates, type Candidate } from "@/hooks/useCandidates";

interface CandidatePhotoUploadProps {
  candidate: Candidate;
  onSuccess?: () => void;
}

export const CandidatePhotoUpload = ({ candidate, onSuccess }: CandidatePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { updateCandidate } = useCandidates();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `candidate-${candidate.id}-${Date.now()}.${fileExt}`;
      const filePath = `candidates/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('candidate-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('candidate-photos')
        .getPublicUrl(filePath);

      // Update candidate in database
      const success = await updateCandidate(candidate.id, {
        image_url: publicUrl,
      });

      if (success) {
        toast({
          title: "Sucesso",
          description: "Foto atualizada com sucesso!",
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da foto. Tente novamente.",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    try {
      setUploading(true);
      
      // Remove from storage if exists
      if (candidate.image_url && candidate.image_url.includes('candidate-photos')) {
        const filePath = candidate.image_url.split('/').slice(-2).join('/');
        await supabase.storage
          .from('candidate-photos')
          .remove([filePath]);
      }

      // Update candidate in database
      const success = await updateCandidate(candidate.id, {
        image_url: null,
      });

      if (success) {
        setPreview(null);
        toast({
          title: "Sucesso",
          description: "Foto removida com sucesso!",
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover a foto.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Foto do Candidato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={preview || candidate.image_url || undefined} 
              alt={candidate.name} 
            />
            <AvatarFallback className="text-lg">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                id={`photo-upload-${candidate.id}`}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => document.getElementById(`photo-upload-${candidate.id}`)?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Enviando..." : "Selecionar Foto"}
              </Button>
              
              {(candidate.image_url || preview) && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={removePhoto}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};