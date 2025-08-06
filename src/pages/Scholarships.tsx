import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Calendar, Euro, Users, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  description: string;
  eligibility: string[];
  level: 'undergraduate' | 'graduate' | 'phd' | 'vocational';
  link: string;
}

const Scholarships = () => {
  const { t } = useLanguage();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  useEffect(() => {
    // Real scholarship data based on Portuguese institutions
    const realScholarships: Scholarship[] = [
      {
        id: "1",
        title: "Abertura de Concurso de Bolsas de Estudo do Camões – Instituto da Cooperação e da Língua",
        provider: "Instituto Camões",
        amount: "€697/mês",
        deadline: "11/06/2025",
        category: "Cooperação",
        description: "O Programa de Bolsas de Estudo da Cooperação Portuguesa, dirige-se a cidadãos moçambicanos para frequência em cursos de nível de Licenciatura em instituições públicas portuguesas.",
        eligibility: ["Cidadãos moçambicanos", "Curso de Licenciatura", "Instituições públicas portuguesas"],
        level: "undergraduate",
        link: "https://www.instituto-camoes.pt/bolsas"
      },
      {
        id: "2", 
        title: "Candidaturas abertas - Programa de Bolsas de Estudo para frequência de Cursos de Verão 2025",
        provider: "Instituto Camões",
        amount: "Financiamento total",
        deadline: "11/06/2025",
        category: "Cursos de Verão",
        description: "Candidaturas ao Programa de Bolsas de Estudo para frequência de Cursos de Verão 2025 - Online. Nos termos do Aviso de Abertura do concurso para Bolsas de Estudo.",
        eligibility: ["Cursos online", "Verão 2025", "Candidatura aberta"],
        level: "graduate",
        link: "https://www.instituto-camoes.pt/cursos-verao"
      },
      {
        id: "3",
        title: "Formação em Portugal",
        provider: "Instituto Camões",
        amount: "Variável",
        deadline: "11/06/2025", 
        category: "Formação",
        description: "Programas de formação especializada em Portugal para estudantes internacionais.",
        eligibility: ["Estudantes internacionais", "Formação especializada", "Portugal"],
        level: "vocational",
        link: "https://www.instituto-camoes.pt/formacao"
      },
      {
        id: "4",
        title: "Regimes Especiais",
        provider: "DGES - Direção-Geral do Ensino Superior",
        amount: "Propinas reduzidas",
        deadline: "11/06/2025",
        category: "Acesso Especial",
        description: "Regimes especiais de acesso ao ensino superior para estudantes com condições específicas.",
        eligibility: ["Condições especiais", "Ensino superior", "Acesso facilitado"],
        level: "undergraduate",
        link: "https://www.dges.gov.pt/regimes-especiais"
      },
      {
        id: "5",
        title: "D - Bolseiros nacionais de países lusófonos",
        provider: "DGES - Direção-Geral do Ensino Superior",
        amount: "€760/mês",
        deadline: "11/06/2025",
        category: "Lusofonia",
        description: "Bolsas para estudantes nacionais de países de língua portuguesa para estudar em Portugal.",
        eligibility: ["Países lusófonos", "Estudantes nacionais", "Portugal"],
        level: "graduate",
        link: "https://www.dges.gov.pt/bolseiros-lusofonos"
      },
      {
        id: "6",
        title: "Bolsas de Estudo Para o Ensino Superior",
        provider: "Governo de Portugal",
        amount: "€1.063/mês",
        deadline: "Permanente",
        category: "Ensino Superior",
        description: "Programa nacional de bolsas de estudo para estudantes do ensino superior com necessidades económicas.",
        eligibility: ["Necessidades económicas", "Ensino superior", "Estudantes portugueses"],
        level: "undergraduate",
        link: "https://www.dges.gov.pt/bolsas-ensino-superior"
      }
    ];

    setScholarships(realScholarships);
    setFilteredScholarships(realScholarships);
  }, []);

  useEffect(() => {
    let filtered = scholarships;

    if (searchTerm) {
      filtered = filtered.filter(scholarship => 
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(scholarship => scholarship.category === categoryFilter);
    }

    if (levelFilter && levelFilter !== "all") {
      filtered = filtered.filter(scholarship => scholarship.level === levelFilter);
    }

    setFilteredScholarships(filtered);
  }, [searchTerm, categoryFilter, levelFilter, scholarships]);

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'undergraduate': return 'Licenciatura';
      case 'graduate': return 'Mestrado';
      case 'phd': return 'Doutoramento';
      case 'vocational': return 'Profissional';
      default: return level;
    }
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{t('scholarships.title')}</h1>
          <p className="text-muted-foreground">{t('scholarships.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar bolsas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="Cooperação">Cooperação</SelectItem>
              <SelectItem value="Cursos de Verão">Cursos de Verão</SelectItem>
              <SelectItem value="Formação">Formação</SelectItem>
              <SelectItem value="Acesso Especial">Acesso Especial</SelectItem>
              <SelectItem value="Lusofonia">Lusofonia</SelectItem>
              <SelectItem value="Ensino Superior">Ensino Superior</SelectItem>
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Nível de Ensino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="undergraduate">Licenciatura</SelectItem>
              <SelectItem value="graduate">Mestrado</SelectItem>
              <SelectItem value="phd">Doutoramento</SelectItem>
              <SelectItem value="vocational">Profissional</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setLevelFilter("all");
            }}
          >
            Limpar Filtros
          </Button>
        </div>

        {/* Scholarship Listings */}
        <div className="grid gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                      {isDeadlineApproaching(scholarship.deadline) && (
                        <Badge variant="destructive" className="text-xs">
                          Prazo próximo!
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-medium text-primary">{scholarship.provider}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{scholarship.category}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{getLevelLabel(scholarship.level)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('scholarships.deadline')}: {scholarship.deadline}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{scholarship.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('scholarships.eligibility')}:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.eligibility.map((criteria, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full md:w-auto" 
                  onClick={() => window.open(scholarship.link, '_blank')}
                >
                  Mais informações
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma bolsa encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;