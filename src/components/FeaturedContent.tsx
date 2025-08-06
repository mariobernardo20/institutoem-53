import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturedContent = () => {
  const featuredItems = [
    {
      type: "Imigração",
      title: "Guia Completo: Visto D7 Portugal 2024",
      description: "Tudo o que precisa saber sobre o visto D7 para aposentados e pessoas com rendimentos passivos.",
      date: "2024-08-06",
      readTime: "8 min",
      featured: true,
      link: "/imigracao"
    },
    {
      type: "Emprego",
      title: "Top 10 Empresas que Contratam Estrangeiros",
      description: "Lista atualizada das melhores empresas portuguesas que apoiam a contratação internacional.",
      date: "2024-08-05",
      readTime: "6 min",
      featured: true,
      link: "/jobs"
    },
    {
      type: "Educação",
      title: "Bolsas Erasmus+ para 2024/2025",
      description: "Programa de bolsas para estudos na Europa. Inscrições abertas até setembro.",
      date: "2024-08-04",
      readTime: "5 min",
      featured: false,
      link: "/scholarships"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Conteúdo em Destaque</h2>
        <Link to="/search">
          <Button variant="outline" size="sm">
            Ver Tudo
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {item.type}
                </Badge>
                {item.featured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.date).toLocaleDateString('pt-PT')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </div>
              </div>
              
              <Link to={item.link}>
                <Button variant="outline" size="sm" className="w-full">
                  Ler Mais
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};