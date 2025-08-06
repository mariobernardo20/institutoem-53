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
  return <div className="space-y-6">
      
      
      
    </div>;
};