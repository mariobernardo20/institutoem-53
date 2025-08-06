import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Briefcase } from "lucide-react";
import { useCandidates, type Candidate } from "@/hooks/useCandidates";

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidateById } = useCandidates();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCandidate(id);
    }
  }, [id]);

  const fetchCandidate = async (candidateId: string) => {
    try {
      const data = await getCandidateById(candidateId);
      setCandidate(data);
    } catch (error) {
      console.error('Error fetching candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Candidato não encontrado.</p>
            <Button onClick={() => navigate('/candidatos')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Candidatos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/candidatos')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Candidatos
          </Button>
          
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              {candidate.image_url ? (
                <img
                  src={candidate.image_url}
                  alt={candidate.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{candidate.name}</h1>
              <p className="text-xl text-muted-foreground mb-3">{candidate.area}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  {candidate.experience_years} {candidate.experience_years === 1 ? 'ano' : 'anos'} de experiência
                </Badge>
                {candidate.location && (
                  <Badge variant="outline" className="text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {candidate.location}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sobre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {candidate.description}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Competências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            {candidate.education && (
              <Card>
                <CardHeader>
                  <CardTitle>Formação Acadêmica</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{candidate.education}</p>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {candidate.certifications && candidate.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {candidate.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                )}
                
                {candidate.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.phone}</span>
                  </div>
                )}

                {candidate.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.location}</span>
                  </div>
                )}

                {candidate.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Registrado em {new Date(candidate.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            {candidate.languages && candidate.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Idiomas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => window.open(`mailto:${candidate.email}?subject=Interesse no seu perfil profissional&body=Olá ${candidate.name},%0D%0A%0D%0AVi o seu perfil e gostaria de conversar sobre oportunidades profissionais.%0D%0A%0D%0ACumprimentos`, '_blank')}
                  disabled={!candidate.email}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${candidate.phone}`, '_self')}
                  disabled={!candidate.phone}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;