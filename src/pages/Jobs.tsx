import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Euro, Clock, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  description: string;
  requirements: string[];
  posted: string;
}

const Jobs = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    // Simulate real job data
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Desenvolvedor Full Stack",
        company: "TechStart Lisboa",
        location: "Lisboa",
        salary: "€35.000 - €45.000",
        type: "full-time",
        description: "Procuramos um desenvolvedor experiente para integrar nossa equipa.",
        requirements: ["React", "Node.js", "TypeScript", "SQL"],
        posted: "2 dias atrás"
      },
      {
        id: "2", 
        title: "Gestor de Marketing Digital",
        company: "MarketPro",
        location: "Porto",
        salary: "€28.000 - €35.000",
        type: "full-time",
        description: "Oportunidade para liderar estratégias de marketing digital.",
        requirements: ["Google Ads", "SEO", "Analytics", "Social Media"],
        posted: "1 semana atrás"
      },
      {
        id: "3",
        title: "Designer UX/UI",
        company: "Creative Agency",
        location: "Remoto",
        salary: "€30.000 - €40.000",
        type: "remote",
        description: "Criar experiências digitais excepcionais para nossos clientes.",
        requirements: ["Figma", "Adobe Creative Suite", "Prototipagem", "Design Thinking"],
        posted: "3 dias atrás"
      },
      {
        id: "4",
        title: "Analista de Dados",
        company: "DataInsights",
        location: "Coimbra",
        salary: "€25.000 - €32.000",
        type: "contract",
        description: "Analisar dados e criar relatórios estratégicos.",
        requirements: ["Python", "SQL", "Power BI", "Statistics"],
        posted: "5 dias atrás"
      }
    ];

    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter(job => job.location === locationFilter);
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, typeFilter, jobs]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return t('jobs.fullTime');
      case 'part-time': return t('jobs.partTime');
      case 'contract': return t('jobs.contract');
      case 'remote': return t('jobs.remote');
      default: return type;
    }
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
          
          <h1 className="text-3xl font-bold mb-2">{t('jobs.title')}</h1>
          <p className="text-muted-foreground">{t('jobs.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar vagas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('jobs.location')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as localizações</SelectItem>
              <SelectItem value="Lisboa">Lisboa</SelectItem>
              <SelectItem value="Porto">Porto</SelectItem>
              <SelectItem value="Coimbra">Coimbra</SelectItem>
              <SelectItem value="Remoto">Remoto</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('jobs.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="full-time">{t('jobs.fullTime')}</SelectItem>
              <SelectItem value="part-time">{t('jobs.partTime')}</SelectItem>
              <SelectItem value="contract">{t('jobs.contract')}</SelectItem>
              <SelectItem value="remote">{t('jobs.remote')}</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setLocationFilter("all");
              setTypeFilter("all");
            }}
          >
            Limpar Filtros
          </Button>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <p className="text-lg font-medium text-primary">{job.company}</p>
                  </div>
                  <Badge variant="secondary">{getTypeLabel(job.type)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.posted}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{job.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Requisitos:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  {t('jobs.apply')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma vaga encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;