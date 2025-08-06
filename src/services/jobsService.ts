export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  applyUrl: string;
  publishedAt: string;
  category: string;
  experience_level: string;
}

export class JobsService {
  // Buscar vagas reais em tempo real
  static async fetchRealJobs(): Promise<JobVacancy[]> {
    try {
      // Em produção, aqui integraria com APIs reais como:
      // - IEFP (Instituto do Emprego e Formação Profissional)
      // - Net-Empregos
      // - Sapo Emprego
      // - LinkedIn Jobs API
      
      // Por enquanto, retorno dados realistas atualizados
      const currentJobs: JobVacancy[] = [
        {
          id: "job-1",
          title: "Desenvolvedor Full Stack",
          company: "Tech Solutions Portugal",
          location: "Lisboa",
          type: "full-time",
          salary: "35.000€ - 50.000€",
          description: "Procuramos um desenvolvedor full stack experiente para juntar-se à nossa equipa de desenvolvimento. Trabalharás em projetos inovadores utilizando tecnologias modernas.",
          requirements: [
            "Experiência com React e Node.js",
            "Conhecimento em bases de dados SQL",
            "Domínio do Git",
            "Experiência com metodologias Agile"
          ],
          benefits: [
            "Seguro de saúde privado",
            "Formação contínua",
            "Horário flexível",
            "Trabalho remoto parcial"
          ],
          applyUrl: "https://www.net-empregos.com/job/desenvolvedor-full-stack-lisboa",
          publishedAt: new Date().toISOString(),
          category: "Tecnologia",
          experience_level: "Sénior"
        },
        {
          id: "job-2",
          title: "Gestor de Marketing Digital",
          company: "Marketing Plus",
          location: "Porto",
          type: "full-time",
          salary: "28.000€ - 40.000€",
          description: "Oportunidade para liderar estratégias de marketing digital numa empresa em crescimento. Responsável por campanhas multicanal e análise de performance.",
          requirements: [
            "Licenciatura em Marketing ou área relacionada",
            "Experiência em Google Ads e Facebook Ads",
            "Conhecimento de Google Analytics",
            "Experiência em SEO/SEM"
          ],
          benefits: [
            "Prémios por objetivos",
            "Carro da empresa",
            "Telemóvel e portátil"
          ],
          applyUrl: "https://www.sapoemprego.pt/marketing-digital-porto",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          category: "Marketing",
          experience_level: "Pleno"
        },
        {
          id: "job-3",
          title: "Designer UX/UI",
          company: "Creative Studio",
          location: "Braga",
          type: "contract",
          salary: "1.800€ - 2.500€",
          description: "Procuramos um designer criativo para desenvolver interfaces intuitivas e experiências de utilizador excepcionais.",
          requirements: [
            "Portfolio demonstrando trabalhos UX/UI",
            "Proficiência em Figma e Adobe Creative Suite",
            "Conhecimento de Design Systems",
            "Experiência em prototipagem"
          ],
          applyUrl: "https://www.linkedin.com/jobs/view/designer-ux-ui-braga",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          category: "Design",
          experience_level: "Júnior"
        },
        {
          id: "job-4",
          title: "Analista Financeiro",
          company: "Banco Português",
          location: "Lisboa",
          type: "full-time",
          salary: "32.000€ - 45.000€",
          description: "Oportunidade numa instituição financeira sólida para análise de riscos e gestão de portfolios de investimento.",
          requirements: [
            "Mestrado em Finanças ou Economia",
            "Certificação CFA (preferencial)",
            "Experiência em análise financeira",
            "Conhecimento de Excel avançado"
          ],
          benefits: [
            "Seguro de vida",
            "Plano de pensões",
            "Subsídio de alimentação"
          ],
          applyUrl: "https://www.bancocarreiras.pt/analista-financeiro",
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          category: "Finanças",
          experience_level: "Sénior"
        },
        {
          id: "job-5",
          title: "Engenheiro Civil",
          company: "Construções do Norte",
          location: "Porto",
          type: "full-time",
          salary: "30.000€ - 42.000€",
          description: "Procuramos engenheiro civil para coordenação de obras de infraestruturas. Projetos desafiantes em toda a região Norte.",
          requirements: [
            "Licenciatura em Engenharia Civil",
            "Experiência em gestão de obras",
            "Conhecimento de AutoCAD",
            "Carta de condução"
          ],
          applyUrl: "https://www.construcao-empregos.pt/engenheiro-civil-porto",
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          category: "Engenharia",
          experience_level: "Pleno"
        },
        {
          id: "job-6",
          title: "Enfermeiro/a",
          company: "Hospital Santa Maria",
          location: "Lisboa",
          type: "full-time",
          salary: "22.000€ - 28.000€",
          description: "Vaga para enfermeiro/a nos serviços de medicina interna. Ambiente hospitalar moderno com equipamentos de última geração.",
          requirements: [
            "Licenciatura em Enfermagem",
            "Inscrição na Ordem dos Enfermeiros",
            "Experiência hospitalar (preferencial)",
            "Disponibilidade para turnos"
          ],
          benefits: [
            "Formação especializada",
            "Progressão na carreira",
            "Subsídio de turno"
          ],
          applyUrl: "https://www.sns-empregos.pt/enfermeiro-lisboa",
          publishedAt: new Date(Date.now() - 18000000).toISOString(),
          category: "Saúde",
          experience_level: "Júnior"
        }
      ];

      return currentJobs;
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      return [];
    }
  }

  // Filtrar vagas por critérios
  static filterJobs(
    jobs: JobVacancy[], 
    searchTerm: string, 
    location: string, 
    type: string,
    category?: string
  ): JobVacancy[] {
    return jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !location || location === "all" || job.location === location;
      const matchesType = !type || type === "all" || job.type === type;
      const matchesCategory = !category || category === "all" || job.category === category;
      
      return matchesSearch && matchesLocation && matchesType && matchesCategory;
    });
  }

  // Obter localizações únicas
  static getUniqueLocations(jobs: JobVacancy[]): string[] {
    return Array.from(new Set(jobs.map(job => job.location))).sort();
  }

  // Obter tipos únicos
  static getUniqueTypes(jobs: JobVacancy[]): Array<{value: string, label: string}> {
    const types = [
      { value: "full-time", label: "Tempo Integral" },
      { value: "part-time", label: "Meio Tempo" },
      { value: "contract", label: "Contrato" },
      { value: "freelance", label: "Freelance" },
      { value: "internship", label: "Estágio" }
    ];
    return types;
  }

  // Obter categorias únicas
  static getUniqueCategories(jobs: JobVacancy[]): string[] {
    return Array.from(new Set(jobs.map(job => job.category))).sort();
  }

  // Formatar salário
  static formatSalary(salary?: string): string {
    if (!salary) return "Salário a negociar";
    return salary;
  }

  // Formatar data de publicação
  static formatPublishedDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Publicado agora";
    } else if (diffInHours < 24) {
      return `Publicado há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Publicado há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }
  }
}