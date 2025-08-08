import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { NewsService } from "@/services/newsService";
import type { NewsItem } from "@/types/database";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNews(id);
    }
  }, [id]);

  const loadNews = async (newsId: string) => {
    try {
      setLoading(true);
      const newsItem = await NewsService.getNewsById(newsId);
      setNews(newsItem);
    } catch (error) {
      console.error("Erro ao carregar notícia:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Notícia não encontrada</h2>
            <Button onClick={() => navigate("/")}>
              Voltar à página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <article>
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                {news.category}
              </Badge>
              
              <CardTitle className="text-3xl font-bold leading-tight">
                {news.title}
              </CardTitle>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {news.published_at 
                      ? new Date(news.published_at).toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })
                      : new Date(news.created_at).toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{NewsService.formatRelativeTime(news.created_at)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {news.image_url && (
              <div className="mb-6">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: news.content.replace(/\n/g, '<br>') 
                }}
                className="text-foreground leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}