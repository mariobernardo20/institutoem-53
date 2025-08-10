import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsService } from "@/services/newsService";
import { Tables } from "@/integrations/supabase/types";

type NewsItem = Tables<"news">;

export const FeaturedContent = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        // Buscar notícias marcadas como destaque
        const allNews = await NewsService.getAllNews();
        const featured = allNews.filter(news => news.is_featured).slice(0, 6);
        
        // Se não houver notícias em destaque, buscar as mais recentes
        if (featured.length === 0) {
          const recentNews = allNews.slice(0, 3);
          setFeaturedNews(recentNews);
        } else {
          setFeaturedNews(featured);
        }
      } catch (error) {
        console.error("Erro ao carregar notícias em destaque:", error);
        // Fallback para dados mock se houver erro
        setFeaturedNews([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedNews();
  }, []);

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    return date.toLocaleDateString('pt-PT');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Imigração": return "📋";
      case "Direito": return "⚖️";
      case "Empreendedorismo": return "🚀";
      case "Ação Social": return "🤝";
      case "Entretenimento": return "🎭";
      case "Espiritualidade": return "🕯️";
      case "Negócios": return "💼";
      case "Tecnologia": return "💻";
      case "Saúde": return "🏥";
      case "Economia": return "💰";
      case "Educação": return "📚";
      case "Preços": return "💲";
      default: return "📄";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Conteúdo em Destaque</h2>
        <Star className="h-6 w-6 text-yellow-500" />
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-muted rounded w-full mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredNews.length > 0 ? (
            featuredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="default">
                      {getCategoryIcon(item.category)} {item.category}
                    </Badge>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{item.content}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatRelativeTime(item.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Leitura rápida</span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/news/${item.id}`} className="flex items-center gap-2">
                      Ler Mais
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nenhuma notícia em destaque no momento.</p>
              <p className="text-sm text-muted-foreground mt-2">
                As notícias marcadas como destaque aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};