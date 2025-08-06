import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsService } from "@/services/newsService";
import { NewsManagement } from "./NewsManagement";
import { AdminImageUpload } from "./AdminImageUpload";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Database, CheckCircle, FileText, Upload, Settings } from "lucide-react";

export const NewsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadInitialNews = async () => {
    setLoading(true);
    try {
      // Carregar notícias de imigração
      const immigrationNews = await NewsService.searchRealNews("Imigração", "imigração portugal");
      for (const news of immigrationNews) {
        await NewsService.saveNews({
          title: news.title,
          content: news.content,
          category: "Imigração",
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: news.publishedAt
        });
      }

      // Carregar notícias de direito
      const lawNews = await NewsService.searchRealNews("Direito", "direito portugal");
      for (const news of lawNews) {
        await NewsService.saveNews({
          title: news.title,
          content: news.content,
          category: "Direito", 
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: news.publishedAt
        });
      }

      toast({
        title: "Sucesso!",
        description: `${immigrationNews.length + lawNews.length} notícias carregadas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar notícias iniciais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDailyNews = async () => {
    setLoading(true);
    try {
      await NewsService.updateDailyNews();
      toast({
        title: "Atualização concluída!",
        description: "Notícias atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar notícias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel de Administração
          </h1>
          <p className="text-muted-foreground">
            Gerencie notícias e uploads de imagens para o sistema
          </p>
        </div>

        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="management">
              <FileText className="h-4 w-4 mr-2" />
              Gerenciar Notícias
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload de Fotos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="mt-6">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sistema de Notícias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Automação de Notícias</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      O sistema busca automaticamente notícias atualizadas das principais fontes oficiais
                      de Imigração e Direito em Portugal.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">AIMA</Badge>
                      <Badge variant="secondary">Tribunal Constitucional</Badge>
                      <Badge variant="secondary">Ministério da Justiça</Badge>
                      <Badge variant="secondary">Portal do Governo</Badge>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Ações do Sistema</h4>
                    <div className="space-y-3">
                      <Button
                        onClick={loadInitialNews}
                        disabled={loading}
                        className="w-full"
                        variant="default"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Carregar Notícias Iniciais
                      </Button>

                      <Button
                        onClick={updateDailyNews}
                        disabled={loading}
                        className="w-full"
                        variant="outline"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Atualizar Notícias Diárias
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Categorias Ativas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">📋 Imigração</span>
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">⚖️ Direito</span>
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload de Fotos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminImageUpload />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};