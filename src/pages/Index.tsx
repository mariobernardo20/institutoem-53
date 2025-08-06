import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Shield, Users, FileText, Radio, TrendingUp, Calendar, Star } from "lucide-react";
import Header from "@/components/Header";
import CategoryMenu from "@/components/CategoryMenu";
import SearchHero from "@/components/SearchHero";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";
import RadioPlayer from "@/components/RadioPlayer";
import Footer from "@/components/Footer";
import { PortugalNews } from "@/components/PortugalNews";
import { QuickStats } from "@/components/QuickStats";
import { FeaturedContent } from "@/components/FeaturedContent";
const Index = () => {
  const [activeFilter, setActiveFilter] = useState("Imigração");
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Radio Player - Fixed Position */}
      <div className="fixed bottom-4 right-4 z-50">
        <RadioPlayer />
      </div>
      
      <CategoryMenu activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchHero />
      
      {/* Hero Section with Enhanced Design */}
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <QuickStats />
        </div>
      </div>
      
      {/* Main Content Section with Better Organization */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Featured Content */}
              <div className="lg:col-span-2">
                <FeaturedContent />
              </div>
            </div>

            {/* Services Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-green-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Candidatos</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Encontre profissionais qualificados para sua empresa
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/candidates')}
                    className="w-full"
                  >
                    Ver Candidatos
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Vagas</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Oportunidades de emprego em Portugal
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/jobs')}
                    className="w-full"
                  >
                    Ver Vagas
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Radio className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Rádio</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Escute nossa rádio ao vivo 24/7
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/radio')}
                    className="w-full"
                  >
                    Ouvir Rádio
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-2xl font-bold text-foreground">Explorar por Categoria</h2>
              </div>
              <SearchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              <SearchResults activeFilter={activeFilter} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <PortugalNews />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/candidate-profile')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Registar como Candidato
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/scholarships')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Bolsas de Estudo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/immigration')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Guia de Imigração
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Index;