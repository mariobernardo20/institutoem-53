import { useState, useEffect } from "react";
import { NewsService } from "@/services/newsService";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type NewsItem = Tables<"news">;

export const useSearch = (searchQuery: string, category: string) => {
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const performSearch = async (query: string, cat: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let searchResults: NewsItem[];
      
      if (query.trim()) {
        // Enhanced search with real news integration
        try {
          // First try database search
          searchResults = await NewsService.searchNews(query, cat);
          
          // If no results found in database, try real news search
          if (searchResults.length === 0) {
            console.log("No database results, trying real news search...");
            const { RealNewsService } = await import("@/services/realNewsService");
            const realNewsResults = await RealNewsService.searchNews(query, cat);
            
            // Convert real news to NewsItem format for display
            searchResults = realNewsResults.map((item, index) => ({
              id: `real-${index}`,
              title: item.title,
              content: item.content,
              category: cat,
              image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
              published_at: item.publishedAt,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              author_id: null,
              status: "published" as const,
              is_featured: false
            }));
          }
        } catch (dbError) {
          console.error("Erro na busca, usando dados locais:", dbError);
          searchResults = await getLocalSearchResults(query, cat);
        }
      } else {
        // No search term, show all news for category
        try {
          if (cat === "Todas") {
            const [immigrationNews, lawNews] = await Promise.all([
              NewsService.getNewsByCategory("Imigração"),
              NewsService.getNewsByCategory("Direito")
            ]);
            searchResults = [...immigrationNews, ...lawNews].sort(
              (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
            );
          } else {
            searchResults = await NewsService.getNewsByCategory(cat);
          }
          
          // If no database results, fetch from real news service
          if (searchResults.length === 0) {
            console.log("No database results, fetching real news...");
            const { RealNewsService } = await import("@/services/realNewsService");
            const realNewsResults = await RealNewsService.fetchRealNews(cat);
            
            searchResults = realNewsResults.map((item, index) => ({
              id: `real-${index}`,
              title: item.title,
              content: item.content,
              category: cat,
              image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
              published_at: item.publishedAt,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              author_id: null,
              status: "published" as const,
              is_featured: false
            }));
          }
        } catch (dbError) {
          console.error("Erro ao buscar do banco de dados, usando dados locais:", dbError);
          searchResults = await getLocalSearchResults("", cat);
        }
      }
      
      setResults(searchResults);
    } catch (err) {
      setError("Erro ao realizar busca");
      console.error("Erro na busca:", err);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocalSearchResults = async (query: string, category: string): Promise<NewsItem[]> => {
    // Dados simulados para fallback
    const mockNewsData = {
      "Imigração": [
        {
          id: "1",
          title: "Portugal facilita renovação de autorizações de residência para imigrantes",
          content: "O Governo português anunciou novas medidas para simplificar o processo de renovação de autorizações de residência, reduzindo os prazos de espera em até 50%. A medida beneficia especialmente cidadãos da CPLP.",
          category: "Imigração",
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: null,
          status: "published",
          is_featured: false
        },
        {
          id: "2", 
          title: "AIMA lança nova plataforma digital para pedidos de nacionalidade",
          content: "A Agência para a Integração, Migrações e Asilo (AIMA) disponibiliza uma nova plataforma online que permite submeter pedidos de nacionalidade portuguesa de forma completamente digital.",
          category: "Imigração",
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: null,
          status: "published",
          is_featured: false
        },
        {
          id: "3",
          title: "Nova lei de imigração entra em vigor em 2025 com mudanças significativas",
          content: "A nova legislação de imigração portuguesa, que entra em vigor no próximo ano, introduz alterações importantes nos critérios de concessão de vistos de trabalho e residência.",
          category: "Imigração",
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: new Date(Date.now() - 7200000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: null,
          status: "published",
          is_featured: false
        }
      ],
      "Direito": [
        {
          id: "4",
          title: "Novo Código de Processo Civil simplifica procedimentos judiciais",
          content: "As alterações ao Código de Processo Civil, aprovadas pelo Parlamento, introduzem medidas de simplificação e digitalização que prometem acelerar os processos judiciais em Portugal.",
          category: "Direito",
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: null,
          status: "published",
          is_featured: false
        },
        {
          id: "5",
          title: "Tribunal Constitucional declara inconstitucionalidade de artigo da Lei do Arrendamento",
          content: "O Tribunal Constitucional português declarou a inconstitucionalidade de um artigo da Lei do Arrendamento Urbano, afetando milhares de contratos de arrendamento em todo o país.",
          category: "Direito",
          image_url: "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
          published_at: new Date(Date.now() - 1800000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: null,
          status: "published",
          is_featured: false
        }
      ]
    };

    let allResults: NewsItem[] = [];
    
    if (category === "Todas") {
      allResults = [...mockNewsData["Imigração"], ...mockNewsData["Direito"]];
    } else {
      allResults = mockNewsData[category as keyof typeof mockNewsData] || [];
    }

    // Filtrar por query se fornecida
    if (query.trim()) {
      const queryLower = query.toLowerCase();
      allResults = allResults.filter(item => 
        item.title.toLowerCase().includes(queryLower) || 
        item.content.toLowerCase().includes(queryLower)
      );
    }
    
    return allResults;
  };

  useEffect(() => {
    performSearch(searchQuery, category);
  }, [searchQuery, category]);

  return {
    results,
    loading,
    error,
    search: performSearch
  };
};