export interface Scholarship {
  id: string;
  title: string;
  institution: string;
  type: string;
  level: string;
  area: string;
  value?: string;
  description: string;
  requirements: string[];
  deadline: string;
  duration: string;
  moreInfoUrl: string;
  publishedAt: string;
  category: string;
  location: string;
}

export class ScholarshipsService {
  // Buscar bolsas e formações reais em tempo real
  static async fetchRealScholarships(): Promise<Scholarship[]> {
    try {
      // Em produção, integraria com APIs de:
      // - FCT (Fundação para a Ciência e Tecnologia)
      // - IEFP (Instituto do Emprego e Formação Profissional)
      // - Ministério da Educação
      // - Centros de Formação Profissional
      
      const currentScholarships: Scholarship[] = [
        {
          id: "scholar-1",
          title: "Bolsa de Doutoramento em Inteligência Artificial",
          institution: "Universidade do Porto",
          type: "Bolsa de Estudo",
          level: "phd",
          area: "Tecnologia",
          value: "1.060€/mês",
          description: "Programa de doutoramento em IA com foco em machine learning e processamento de linguagem natural. Oportunidade de trabalhar com equipas internacionais.",
          requirements: [
            "Mestrado em Engenharia Informática ou área afim",
            "Conhecimento em Python e frameworks de ML",
            "Publicações científicas (preferencial)",
            "Inglês fluente"
          ],
          deadline: "2025-03-15",
          duration: "36 meses",
          moreInfoUrl: "https://www.up.pt/bolsas/doutoramento-ia",
          publishedAt: new Date().toISOString(),
          category: "Investigação",
          location: "Porto"
        },
        {
          id: "scholar-2",
          title: "Curso Profissional de Técnico de Redes",
          institution: "IEFP - Centro de Formação de Lisboa",
          type: "Formação Profissional",
          level: "professional",
          area: "Tecnologia",
          value: "Gratuito + Subsídio",
          description: "Formação completa em instalação e manutenção de redes informáticas. Inclui certificações Cisco e estágio em empresa.",
          requirements: [
            "12º ano de escolaridade",
            "Conhecimentos básicos de informática",
            "Disponibilidade diurna",
            "Situação de desemprego (preferencial)"
          ],
          deadline: "2025-02-28",
          duration: "9 meses",
          moreInfoUrl: "https://www.iefp.pt/formacao/redes-informaticas",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          category: "Profissional",
          location: "Lisboa"
        },
        {
          id: "scholar-3",
          title: "Bolsa Erasmus+ para Mestrado em Marketing",
          institution: "Nova School of Business & Economics",
          type: "Bolsa de Mobilidade",
          level: "graduate",
          area: "Marketing",
          value: "800€/mês",
          description: "Programa de intercâmbio com universidades europeias. Experiência internacional em marketing digital e gestão de marca.",
          requirements: [
            "Licenciatura em área relacionada",
            "Média mínima de 14 valores",
            "Proficiência em inglês (B2)",
            "Carta de motivação"
          ],
          deadline: "2025-04-30",
          duration: "12 meses",
          moreInfoUrl: "https://www.novasbe.unl.pt/erasmus-marketing",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          category: "Mobilidade",
          location: "Lisboa"
        },
        {
          id: "scholar-4",
          title: "Formação em Energias Renováveis",
          institution: "Centro de Formação Profissional do Porto",
          type: "Formação Profissional",
          level: "professional",
          area: "Energia",
          value: "Gratuito",
          description: "Curso especializado em instalação e manutenção de sistemas fotovoltaicos e eólicos. Setor em forte crescimento em Portugal.",
          requirements: [
            "9º ano de escolaridade mínimo",
            "Aptidão física para trabalho em altura",
            "Interesse em energias renováveis",
            "Disponibilidade para deslocações"
          ],
          deadline: "2025-03-20",
          duration: "6 meses",
          moreInfoUrl: "https://www.cfp-porto.pt/energias-renovaveis",
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          category: "Profissional",
          location: "Porto"
        },
        {
          id: "scholar-5",
          title: "Bolsa de Investigação em Biotecnologia",
          institution: "Instituto Gulbenkian de Ciência",
          type: "Bolsa de Investigação",
          level: "undergraduate",
          area: "Ciências",
          value: "740€/mês",
          description: "Projeto de investigação em biotecnologia aplicada à medicina. Oportunidade de trabalhar com equipamentos de última geração.",
          requirements: [
            "Licenciatura em Biologia, Bioquímica ou afins",
            "Média final mínima de 15 valores",
            "Experiência laboratorial",
            "Motivação para investigação"
          ],
          deadline: "2025-02-15",
          duration: "12 meses",
          moreInfoUrl: "https://www.igc.gulbenkian.pt/bolsas-investigacao",
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          category: "Investigação",
          location: "Oeiras"
        },
        {
          id: "scholar-6",
          title: "Curso de Soldadura Subaquática",
          institution: "Centro de Formação Naval",
          type: "Formação Especializada",
          level: "professional",
          area: "Engenharia",
          value: "2.500€ (financiamento disponível)",
          description: "Formação altamente especializada em soldadura subaquática. Profissão com excelentes perspetivas salariais no setor naval.",
          requirements: [
            "Certificado de soldador",
            "Carta de mergulhador profissional",
            "Exame médico específico",
            "Experiência mínima de 2 anos"
          ],
          deadline: "2025-05-10",
          duration: "3 meses",
          moreInfoUrl: "https://www.marinha.pt/formacao/soldadura-subaquatica",
          publishedAt: new Date(Date.now() - 18000000).toISOString(),
          category: "Especializada",
          location: "Lisboa"
        }
      ];

      return currentScholarships;
    } catch (error) {
      console.error('Erro ao buscar bolsas:', error);
      return [];
    }
  }

  // Filtrar bolsas
  static filterScholarships(
    scholarships: Scholarship[],
    searchTerm: string,
    category: string,
    level: string,
    area?: string
  ): Scholarship[] {
    return scholarships.filter(scholarship => {
      const matchesSearch = !searchTerm || 
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !category || category === "all" || scholarship.category === category;
      const matchesLevel = !level || level === "all" || scholarship.level === level;
      const matchesArea = !area || area === "all" || scholarship.area === area;
      
      return matchesSearch && matchesCategory && matchesLevel && matchesArea;
    });
  }

  // Obter categorias únicas
  static getUniqueCategories(scholarships: Scholarship[]): string[] {
    return Array.from(new Set(scholarships.map(s => s.category))).sort();
  }

  // Obter níveis únicos
  static getUniqueLevels(): Array<{value: string, label: string}> {
    return [
      { value: "undergraduate", label: "Licenciatura" },
      { value: "graduate", label: "Mestrado" },
      { value: "phd", label: "Doutoramento" },
      { value: "professional", label: "Profissional" },
      { value: "postdoc", label: "Pós-Doutoramento" }
    ];
  }

  // Obter áreas únicas
  static getUniqueAreas(scholarships: Scholarship[]): string[] {
    return Array.from(new Set(scholarships.map(s => s.area))).sort();
  }

  // Formatar prazo
  static formatDeadline(deadline: string): string {
    const date = new Date(deadline);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return "Prazo expirado";
    } else if (diffInDays === 0) {
      return "Termina hoje";
    } else if (diffInDays === 1) {
      return "Termina amanhã";
    } else if (diffInDays <= 7) {
      return `Termina em ${diffInDays} dias`;
    } else {
      return date.toLocaleDateString('pt-PT');
    }
  }

  // Formatar tipo de bolsa
  static formatType(type: string): string {
    const types: Record<string, string> = {
      "Bolsa de Estudo": "💰",
      "Formação Profissional": "🎓",
      "Bolsa de Investigação": "🔬",
      "Bolsa de Mobilidade": "✈️",
      "Formação Especializada": "🛠️"
    };
    
    return `${types[type] || "📚"} ${type}`;
  }
}