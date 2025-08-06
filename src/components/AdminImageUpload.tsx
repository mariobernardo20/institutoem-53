import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AdminImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string; url: string }>>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Erro",
            description: `${file.name} não é um arquivo de imagem válido.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Erro",
            description: `${file.name} é muito grande. Máximo 10MB.`,
            variant: "destructive",
          });
          continue;
        }

        // Simulate upload - in real app would upload to storage
        await simulateUpload(file);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload das imagens.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const simulateUpload = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Generate a mock URL similar to the existing pattern
        const mockUrl = `/lovable-uploads/${generateUUID()}.${file.name.split('.').pop()}`;
        
        setUploadedImages(prev => [...prev, {
          name: file.name,
          url: mockUrl
        }]);

        toast({
          title: "Sucesso",
          description: `${file.name} foi carregado com sucesso!`,
        });

        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast({
        title: "Copiado!",
        description: "URL da imagem copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL.",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Removido",
      description: "Imagem removida da lista.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Imagens</CardTitle>
        <p className="text-sm text-muted-foreground">
          Faça upload de imagens para usar em notícias e outros conteúdos do sistema.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP até 10MB cada
            </p>
          </div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="admin-image-upload"
          />
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('admin-image-upload')?.click()}
            className="mt-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Enviando..." : "Selecionar Imagens"}
          </Button>
        </div>

        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Imagens Carregadas</h4>
            <div className="space-y-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {image.url}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(image.url)}
                    >
                      {copiedUrl === image.url ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Como usar</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Faça upload das imagens que deseja usar</p>
            <p>2. Copie a URL da imagem clicando no botão de copiar</p>
            <p>3. Use a URL copiada no campo "URL da Imagem" ao criar/editar notícias</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};