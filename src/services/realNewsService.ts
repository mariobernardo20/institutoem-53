// Real news service to fetch actual news from external APIs
import { supabase } from "@/integrations/supabase/client";

interface RealNewsItem {
  title: string;
  content: string;
  publishedAt: string;
  url?: string;
  source?: string;
}

export class RealNewsService {
  // Simulated real news data for demonstration
  private static mockRealNews = {
    "Imigração": [
      {
        title: "AIMA simplifica procedimentos para autorização de residência em 2024",
        content: "A Agência para a Integração, Migrações e Asilo (AIMA) anunciou hoje novas medidas para acelerar os processos de autorização de residência. As mudanças incluem digitalização completa dos pedidos e redução dos prazos de resposta para 60 dias úteis.",
        publishedAt: new Date().toISOString(),
        source: "Portal do Governo",
        url: "https://www.portugal.gov.pt"
      },
      {
        title: "Novo programa de apoio à integração de imigrantes lançado em Lisboa",
        content: "A Câmara Municipal de Lisboa lançou um programa inovador de apoio à integração de imigrantes, oferecendo cursos de português, apoio jurídico e orientação profissional. O programa tem capacidade para 500 pessoas por trimestre.",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: "CM Lisboa",
        url: "https://www.lisboa.pt"
      },
      {
        title: "Alterações à Lei da Nacionalidade entram em vigor no próximo mês",
        content: "As recentes alterações à Lei da Nacionalidade portuguesa, aprovadas pela Assembleia da República, simplificam o processo de obtenção da cidadania portuguesa para descendentes e reduzem os requisitos de residência.",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: "Assembleia da República",
        url: "https://www.parlamento.pt"
      }
    ],
    "Direito": [
      {
        title: "Tribunal Constitucional aprova nova interpretação do direito ao trabalho",
        content: "O Tribunal Constitucional português emitiu um acórdão histórico sobre o direito ao trabalho, estabelecendo novos precedentes para a proteção de trabalhadores em situação precária e fortalecendo as garantias laborais.",
        publishedAt: new Date().toISOString(),
        source: "Tribunal Constitucional",
        url: "https://www.tribunalconstitucional.pt"
      },
      {
        title: "Nova regulamentação para contratos de arrendamento urbano",
        content: "O Governo aprovou nova regulamentação que estabelece regras mais claras para contratos de arrendamento urbano, incluindo limites para aumentos de renda e proteções adicionais para inquilinos vulneráveis.",
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        source: "Ministério da Justiça",
        url: "https://www.mj.gov.pt"
      },
      {
        title: "Digitalização dos tribunais acelera processos judiciais",
        content: "A implementação do sistema digital CITIUS em todos os tribunais portugueses resultou numa redução média de 30% no tempo de tramitação de processos, melhorando significativamente o acesso à justiça.",
        publishedAt: new Date(Date.now() - 5400000).toISOString(),
        source: "Conselho Superior da Magistratura",
        url: "https://www.csm.org.pt"
      }
    ]
  };

  static async fetchRealNews(category: string): Promise<RealNewsItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call external news APIs
    // For now, return our mock data
    return this.mockRealNews[category as keyof typeof this.mockRealNews] || [];
  }

  static async updateDailyNews(): Promise<void> {
    try {
      const categories = ["Imigração", "Direito"];
      
      for (const category of categories) {
        const newsItems = await this.fetchRealNews(category);
        
        for (const newsItem of newsItems) {
          // Check if news already exists
          const { data: existingNews } = await supabase
            .from("news")
            .select("id")
            .eq("title", newsItem.title)
            .maybeSingle();

          if (!existingNews) {
            // Save new news item
            const { error } = await supabase
              .from("news")
              .insert({
                title: newsItem.title,
                content: newsItem.content,
                category: category,
                image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
                published_at: newsItem.publishedAt,
                status: "published",
                author_id: null
              });

            if (error) {
              console.error("Error saving news:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating daily news:", error);
      throw error;
    }
  }

  static async searchNews(query: string, category: string): Promise<RealNewsItem[]> {
    const allNews = await this.fetchRealNews(category);
    
    if (!query.trim()) {
      return allNews;
    }

    const queryLower = query.toLowerCase();
    return allNews.filter(item => 
      item.title.toLowerCase().includes(queryLower) || 
      item.content.toLowerCase().includes(queryLower)
    );
  }
}