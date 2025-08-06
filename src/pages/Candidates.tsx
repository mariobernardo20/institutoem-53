
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Phone, ArrowLeft, Heart, Eye } from "lucide-react";
import { useCandidates, type Candidate } from "@/hooks/useCandidates";
import Header from "@/components/Header";

const Candidates = () => {
  const navigate = useNavigate();
  const { candidates, loading } = useCandidates();
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, experienceFilter, areaFilter]);

  const filterCandidates = () => {
    let filtered = candidates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Experience filter
    if (experienceFilter && experienceFilter !== "all") {
      const [min, max] = experienceFilter.split('-').map(Number);
      filtered = filtered.filter(candidate => {
        if (max) {
          return candidate.experience_years >= min && candidate.experience_years <= max;
        } else {
          return candidate.experience_years >= min;
        }
      });
    }

    // Area filter
    if (areaFilter && areaFilter !== "all") {
      filtered = filtered.filter(candidate =>
        candidate.area.toLowerCase().includes(areaFilter.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
  };

  const uniqueAreas = Array.from(new Set(candidates.map(c => c.area)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">Carregando candidatos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Candidatos</h1>
          <p className="text-muted-foreground">Encontre profissionais qualificados para sua empresa</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar candidatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Experience Filter */}
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Anos de experiência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="0-2">0-2 anos</SelectItem>
                  <SelectItem value="3-5">3-5 anos</SelectItem>
                  <SelectItem value="6-10">6-10 anos</SelectItem>
                  <SelectItem value="11">11+ anos</SelectItem>
                </SelectContent>
              </Select>

              {/* Area Filter */}
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Área de atuação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  {uniqueAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setExperienceFilter("");
                  setAreaFilter("");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredCandidates.length} candidato(s) encontrado(s)
          </p>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header with profile picture and stats */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      {candidate.image_url ? (
                        <img
                          src={candidate.image_url}
                          alt={candidate.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats in top corners */}
                  <div className="absolute top-0 right-0 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm text-xs">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span>24</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm text-xs">
                      <Eye className="h-3 w-3 text-blue-500" />
                      <span>156</span>
                    </div>
                  </div>
                </div>

                {/* Name and details */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-foreground text-lg">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.area}</p>
                  <Badge variant="secondary" className="mt-2">
                    {candidate.experience_years} {candidate.experience_years === 1 ? 'ano' : 'anos'} de experiência
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 text-center">
                  {candidate.description}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {candidate.email && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                  )}
                  {candidate.phone && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => navigate(`/candidato/${candidate.id}`)}
                >
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum candidato encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
