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

  // Enhanced search with real news integration
  static async searchRealNews(category: string, query: string): Promise<NewsSearchResult[]> {
    try {
      // Import here to avoid circular dependency
      const { RealNewsService } = await import("./realNewsService");
      
      const realNews = await RealNewsService.searchNews(query, category);
      
      return realNews.map(item => ({
        title: item.title,
        content: item.content,
        url: item.url || "#",
        publishedAt: item.publishedAt,
        source: item.source || "Fonte Externa"
      }));
    } catch (error) {
      console.error("Error fetching real news:", error);
      return [];
    }
  }

  // Enhanced daily news update with real news service
  static async updateDailyNews(): Promise<void> {
    try {
      // Use the new AutoNewsService for better news management
      const { AutoNewsService } = await import("./autoNewsService");
      await AutoNewsService.manualUpdate();
    } catch (error) {
      console.error("Error updating daily news:", error);
      throw error;
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

  // Buscar notícias em destaque
  static async getFeaturedNews(): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_featured", true)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Erro ao buscar notícias em destaque:", error);
      return [];
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