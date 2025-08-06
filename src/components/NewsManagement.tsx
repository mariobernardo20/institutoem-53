import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { NewsService } from "@/services/newsService";
import { NewsEditDialog } from "./NewsEditDialog";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Edit, Trash2, Plus, RefreshCw, Loader2 } from "lucide-react";

type NewsItem = Tables<"news">;

export const NewsManagement = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await NewsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar notícias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleEdit = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setEditDialogOpen(true);
  };

  const handleDelete = (newsItem: NewsItem) => {
    setNewsToDelete(newsItem);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;

    setDeleting(true);
    try {
      const success = await NewsService.deleteNews(newsToDelete.id);
      if (success) {
        toast({
          title: "Sucesso!",
          description: "Notícia excluída com sucesso.",
        });
        await loadNews();
      } else {
        throw new Error("Falha ao excluir notícia");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir notícia.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleCreateNew = () => {
    setSelectedNews(null);
    setEditDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Imigração":
        return "📋";
      case "Direito":
        return "⚖️";
      default:
        return "📰";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Notícias</h2>
        <div className="flex gap-2">
          <Button onClick={loadNews} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Notícia
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando notícias...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {news.length > 0 ? (
            news.map((newsItem) => (
              <Card key={newsItem.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {getCategoryIcon(newsItem.category)} {newsItem.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {NewsService.formatRelativeTime(newsItem.published_at)}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {newsItem.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(newsItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(newsItem)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {newsItem.content}
                  </p>
                  {newsItem.image_url && (
                    <div className="mt-3">
                      <img
                        src={newsItem.image_url}
                        alt="Imagem da notícia"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma notícia encontrada.
                </p>
                <Button onClick={handleCreateNew} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira notícia
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <NewsEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        newsItem={selectedNews}
        onSaved={loadNews}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a notícia "{newsToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};