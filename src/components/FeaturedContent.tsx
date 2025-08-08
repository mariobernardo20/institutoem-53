import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";
export const FeaturedContent = () => {
  const featuredItems = [{
    type: "Imigração",
    title: "Guia Completo: Visto D7 Portugal 2024",
    description: "Tudo o que precisa saber sobre o visto D7 para aposentados e pessoas com rendimentos passivos.",
    date: "2024-08-06",
    readTime: "8 min",
    featured: true,
    link: "/imigracao"
  }, {
    type: "Emprego",
    title: "Top 10 Empresas que Contratam Estrangeiros",
    description: "Lista atualizada das melhores empresas portuguesas que apoiam a contratação internacional.",
    date: "2024-08-05",
    readTime: "6 min",
    featured: true,
    link: "/jobs"
  }, {
    type: "Educação",
    title: "Bolsas Erasmus+ para 2024/2025",
    description: "Programa de bolsas para estudos na Europa. Inscrições abertas até setembro.",
    date: "2024-08-04",
    readTime: "5 min",
    featured: false,
    link: "/scholarships"
  }];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Conteúdo em Destaque</h2>
        <Star className="h-6 w-6 text-yellow-500" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={item.featured ? "default" : "secondary"}>
                  {item.type}
                </Badge>
                {item.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.date).toLocaleDateString("pt-PT")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{item.readTime}</span>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link to={item.link} className="flex items-center gap-2">
                  Ler Mais
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};