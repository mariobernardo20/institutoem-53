import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNews } from "@/hooks/useNews";
import { NewsService } from "@/services/newsService";
import NewsCard from "@/components/NewsCard";
import Header from "@/components/Header";
import { ExternalLink, RefreshCw, FileText, Users, Clock, MapPin } from "lucide-react";

const Immigration = () => {
  const { news, loading, refreshNews } = useNews("Imigração");
  const [stats, setStats] = useState({
    totalNews: 0,
    todayNews: 0,
    lastUpdate: ""
  });

  useEffect(() => {
    if (news.length > 0) {
      const today = new Date();
      const todayNews = news.filter(item => {
        const newsDate = new Date(item.published_at);
        return newsDate.toDateString() === today.toDateString();
      });

      setStats({
        totalNews: news.length,
        todayNews: todayNews.length,
        lastUpdate: new Date().toLocaleString('pt-PT')
      });
    }
  }, [news]);

  const immigrationServices = [
    {
      title: "Autorização de Residência",
      description: "Processos de pedido e renovação de autorizações de residência",
      link: "https://www.aima.gov.pt/pt/informacoes/autorizacao-residencia"
    },
    {
      title: "Reagrupamento Familiar",
      description: "Pedidos de visto para reagrupamento familiar",
      link: "https://www.aima.gov.pt/pt/informacoes/reagrupamento-familiar"
    },
    {
      title: "Nacionalidade Portuguesa",
      description: "Processo de aquisição da nacionalidade portuguesa",
      link: "https://www.irn.mj.pt/sections/irn/a_registral/registo-civil/docs-da-nacionalidade/"
    },
    {
      title: "Vistos D7 (Aposentados)",
      description: "Visto para aposentados e pessoas com rendimentos",
      link: "https://www.aima.gov.pt/pt/informacoes/visto-d7"
    }
  ];

  const officialSources = [
    {
      name: "AIMA - Agência para Integração, Migrações e Asilo",
      url: "https://www.aima.gov.pt",
      description: "Portal oficial para todos os assuntos de imigração"
    },
    {
      name: "Portal do Cidadão",
      url: "https://www.portaldocidadao.pt",
      description: "Serviços online do Estado português"
    },
    {
      name: "Consulados Portugueses",
      url: "https://www.portaldiplomatico.mne.gov.pt",
      description: "Rede consular portuguesa no mundo"
    },
    {
      name: "IRN - Instituto dos Registos e Notariado",
      url: "https://www.irn.mj.pt",
      description: "Processos de nacionalidade e documentação"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              🇵🇹 Imigração em Portugal
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Informações atualizadas sobre processos de imigração, vistos, 
              autorizações de residência e nacionalidade portuguesa
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                Atualizado em tempo real
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <MapPin className="h-4 w-4 mr-1" />
                Fontes oficiais portuguesas
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                Para cidadãos CPLP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalNews}</div>
                  <div className="text-sm text-muted-foreground">Total de Notícias</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.todayNews}</div>
                  <div className="text-sm text-muted-foreground">Notícias Hoje</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground">Última Atualização</div>
                  <div className="text-sm font-medium">{stats.lastUpdate}</div>
                </CardContent>
              </Card>
            </div>

            {/* Latest News */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Últimas Notícias de Imigração
                  </CardTitle>
                  <Button onClick={refreshNews} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p>Carregando notícias...</p>
                  </div>
                ) : news.length > 0 ? (
                  <div className="space-y-4">
                    {news.slice(0, 6).map((newsItem) => (
                      <NewsCard
                        key={newsItem.id}
                        title={newsItem.title}
                        category={newsItem.category}
                        date={NewsService.formatRelativeTime(newsItem.published_at)}
                        image={newsItem.image_url || "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png"}
                        excerpt={newsItem.content.substring(0, 150) + "..."}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Nenhuma notícia de imigração disponível no momento.
                    </p>
                    <Button onClick={refreshNews} variant="outline">
                      Carregar Notícias
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Principais Serviços de Imigração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {immigrationServices.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.description}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={service.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Aceder
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Links Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.aima.gov.pt/pt/web/aima/pedido-de-autorizacao-de-residencia" target="_blank" rel="noopener noreferrer">
                    📋 Pedir Autorização de Residência
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.portaldocidadao.pt/servicos/servico-de-estrangeiros-e-fronteiras" target="_blank" rel="noopener noreferrer">
                    📄 Portal do Cidadão
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.aima.gov.pt/pt/web/aima/agendamento" target="_blank" rel="noopener noreferrer">
                    📅 Agendamento AIMA
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.irn.mj.pt" target="_blank" rel="noopener noreferrer">
                    🇵🇹 Nacionalidade Portuguesa
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Official Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fontes Oficiais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {officialSources.map((source, index) => (
                  <div key={index}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {source.name}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      {source.description}
                    </p>
                    {index < officialSources.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Help */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Nossa equipe pode ajudar com processos de imigração em Portugal.
                </p>
                <Button className="w-full">
                  💬 Falar Connosco
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Immigration;