import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type NewsItem = Tables<"news">;

export interface NewsSearchResult {
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  source: string;
}

export class NewsService {
  // Buscar notícias do Supabase
  static async getNewsByCategory(category: string): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("category", category)
      .order("published_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Erro ao buscar notícias:", error);
      return [];
    }

    return data || [];
  }

  // Buscar notícias por texto
  static async searchNews(query: string, category?: string): Promise<NewsItem[]> {
    let queryBuilder = supabase
      .from("news")
      .select("*");

    if (category && category !== "Todas") {
      queryBuilder = queryBuilder.eq("category", category);
    }

    if (query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    const { data, error } = await queryBuilder
      .order("published_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Erro ao buscar notícias:", error);
      return [];
    }

    return data || [];
  }

  // Salvar notícia no Supabase
  static async saveNews(news: Omit<NewsItem, "id" | "created_at" | "updated_at">): Promise<boolean> {
    const { error } = await supabase
      .from("news")
      .insert(news);

    if (error) {
      console.error("Erro ao salvar notícia:", error);
      return false;
    }

    return true;
  }

  // Buscar notícias de fontes reais (simulado - em produção usaria APIs reais)
  static async searchRealNews(category: string, query: string): Promise<NewsSearchResult[]> {
    // Em um ambiente real, aqui integraria com APIs como NewsAPI, Google News, etc.
    // Por enquanto, retorno dados simulados mais realistas
    
    const mockNews: Record<string, NewsSearchResult[]> = {
      "Imigração": [
        {
          title: "Portugal facilita renovação de autorizações de residência para imigrantes",
          content: "O Governo português anunciou novas medidas para simplificar o processo de renovação de autorizações de residência, reduzindo os prazos de espera em até 50%. A medida beneficia especialmente cidadãos da CPLP.",
          url: "https://www.portugal.gov.pt/imigracao-renovacao",
          publishedAt: new Date().toISOString(),
          source: "Portal do Governo Português"
        },
        {
          title: "AIMA lança nova plataforma digital para pedidos de nacionalidade",
          content: "A Agência para a Integração, Migrações e Asilo (AIMA) disponibiliza uma nova plataforma online que permite submeter pedidos de nacionalidade portuguesa de forma completamente digital.",
          url: "https://www.aima.gov.pt/nacionalidade-digital",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: "AIMA"
        },
        {
          title: "Nova lei de imigração entra em vigor em 2025 com mudanças significativas",
          content: "A nova legislação de imigração portuguesa, que entra em vigor no próximo ano, introduz alterações importantes nos critérios de concessão de vistos de trabalho e residência.",
          url: "https://dre.pt/lei-imigracao-2025",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: "Diário da República"
        }
      ],
      "Direito": [
        {
          title: "Novo Código de Processo Civil simplifica procedimentos judiciais",
          content: "As alterações ao Código de Processo Civil, aprovadas pelo Parlamento, introduzem medidas de simplificação e digitalização que prometem acelerar os processos judiciais em Portugal.",
          url: "https://www.parlamento.pt/codigo-processo-civil",
          publishedAt: new Date().toISOString(),
          source: "Assembleia da República"
        },
        {
          title: "Tribunal Constitucional declara inconstitucionalidade de artigo da Lei do Arrendamento",
          content: "O Tribunal Constitucional português declarou a inconstitucionalidade de um artigo da Lei do Arrendamento Urbano, afetando milhares de contratos de arrendamento em todo o país.",
          url: "https://www.tribunalconstitucional.pt/decisao-arrendamento",
          publishedAt: new Date(Date.now() - 1800000).toISOString(),
          source: "Tribunal Constitucional"
        },
        {
          title: "Ministério da Justiça anuncia reforma do sistema de execuções",
          content: "O Ministério da Justiça apresentou um plano abrangente de reforma do sistema de execuções, visando maior eficácia na cobrança de dívidas e proteção dos devedores.",
          url: "https://www.mj.gov.pt/reforma-execucoes",
          publishedAt: new Date(Date.now() - 5400000).toISOString(),
          source: "Ministério da Justiça"
        }
      ]
    };

    return mockNews[category] || [];
  }

  // Atualizar notícias diariamente
  static async updateDailyNews(): Promise<void> {
    const categories = ["Imigração", "Direito"];
    
    for (const category of categories) {
      try {
        const newsResults = await this.searchRealNews(category, category);
        
        for (const newsItem of newsResults) {
          // Verificar se a notícia já existe
          const { data: existingNews } = await supabase
            .from("news")
            .select("id")
            .eq("title", newsItem.title)
            .single();

          if (!existingNews) {
            await this.saveNews({
              title: newsItem.title,
              content: newsItem.content,
              category: category,
              image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
              published_at: newsItem.publishedAt
            });
          }
        }
      } catch (error) {
        console.error(`Erro ao atualizar notícias de ${category}:`, error);
      }
    }
  }

  // Buscar todas as notícias para administração
  static async getAllNews(): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar todas as notícias:", error);
      throw error;
    }

    return data || [];
  }

  // Atualizar notícia
  static async updateNews(id: string, updates: Partial<Omit<NewsItem, "id" | "created_at" | "updated_at">>): Promise<boolean> {
    const { error } = await supabase
      .from("news")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar notícia:", error);
      return false;
    }

    return true;
  }

  // Excluir notícia
  static async deleteNews(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir notícia:", error);
      return false;
    }

    return true;
  }

  // Buscar notícia por ID
  static async getNewsById(id: string): Promise<NewsItem | null> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar notícia por ID:", error);
      return null;
    }

    return data;
  }

  // Formatar data relativa (há X horas/dias)
  static formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return "Agora mesmo";
    } else if (diffInHours < 24) {
      return `${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    } else {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    }
  }
}