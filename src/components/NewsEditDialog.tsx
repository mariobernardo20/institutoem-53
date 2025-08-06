import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";
import { NewsService } from "@/services/newsService";
import { useToast } from "@/components/ui/use-toast";
import { Save, X } from "lucide-react";

type NewsItem = Tables<"news">;

interface NewsEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsItem: NewsItem | null;
  onSaved: () => void;
}

export const NewsEditDialog = ({ open, onOpenChange, newsItem, onSaved }: NewsEditDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (newsItem) {
      setTitle(newsItem.title);
      setContent(newsItem.content);
      setCategory(newsItem.category);
      setImageUrl(newsItem.image_url || "");
    } else {
      setTitle("");
      setContent("");
      setCategory("");
      setImageUrl("");
    }
  }, [newsItem]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (newsItem) {
        // Editar notícia existente
        const success = await NewsService.updateNews(newsItem.id, {
          title: title.trim(),
          content: content.trim(),
          category,
          image_url: imageUrl || "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png"
        });

        if (success) {
          toast({
            title: "Sucesso!",
            description: "Notícia atualizada com sucesso.",
          });
          onSaved();
          onOpenChange(false);
        } else {
          throw new Error("Falha ao atualizar notícia");
        }
      } else {
        // Criar nova notícia
        const success = await NewsService.saveNews({
          title: title.trim(),
          content: content.trim(),
          category,
          image_url: imageUrl || "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: new Date().toISOString()
        });

        if (success) {
          toast({
            title: "Sucesso!",
            description: "Notícia criada com sucesso.",
          });
          onSaved();
          onOpenChange(false);
        } else {
          throw new Error("Falha ao criar notícia");
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar notícia.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {newsItem ? "Editar Notícia" : "Nova Notícia"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da notícia"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Imigração">📋 Imigração</SelectItem>
                <SelectItem value="Direito">⚖️ Direito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/lovable-uploads/..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo da notícia"
              className="mt-1 min-h-[200px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};