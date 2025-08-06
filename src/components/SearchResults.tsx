import NewsCard from "./NewsCard";
import { useNews } from "@/hooks/useNews";
import { NewsService } from "@/services/newsService";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
interface SearchResultsProps {
  activeFilter: string;
}
const SearchResults = ({
  activeFilter
}: SearchResultsProps) => {
  const {
    news,
    loading,
    refreshNews
  } = useNews(activeFilter);
  return <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Notícias de {activeFilter === "Todas" ? "Imigração e Direito" : activeFilter} em Portugal
            </h2>
            <div className="flex items-center gap-4">
              <Button onClick={refreshNews} variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <span className="text-sm text-muted-foreground">
                {news.length} notícias encontradas
              </span>
            </div>
          </div>
          
          {loading ? <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando notícias...</span>
            </div> : <div className="space-y-4">
              {news.length > 0 ? news.map(newsItem => <NewsCard key={newsItem.id} title={newsItem.title} category={newsItem.category} date={NewsService.formatRelativeTime(newsItem.published_at)} image={newsItem.image_url || "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png"} excerpt={newsItem.content.substring(0, 150) + "..."} />) : <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhuma notícia encontrada para "{activeFilter}".
                  </p>
                  <Button onClick={refreshNews} variant="outline" className="mt-4">
                    Carregar notícias
                  </Button>
                </div>}
            </div>}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 border mb-6">
            <h3 className="font-semibold text-foreground mb-4">
              Tópicos em Destaque
            </h3>
            <div className="space-y-3">
              {activeFilter === "Imigração" || activeFilter === "Todas" ? ["Vistos CPLP Portugal", "Autorização de Residência", "Nacionalidade Portuguesa", "AIMA - Processos", "Reagrupamento Familiar"].map((query, index) => <button key={index} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full">
                    {query}
                  </button>) : ["Código Processo Civil", "Lei do Arrendamento", "Direito do Trabalho", "Tribunal Constitucional", "Código Penal"].map((query, index) => <button key={index} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full">
                    {query}
                  </button>)}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold text-foreground mb-4">
              Fontes Oficiais
            </h3>
            <div className="space-y-2 text-sm">
              {activeFilter === "Imigração" || activeFilter === "Todas" ? <>
                  <a href="https://www.aima.gov.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    AIMA - Agência Integração, Migrações e Asilo
                  </a>
                  <a href="https://www.sef.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Portal do Cidadão
                  </a>
                  <a href="https://www.portugal.gov.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Portal do Governo
                  </a>
                </> : <>
                  <a href="https://www.tribunalconstitucional.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Tribunal Constitucional
                  </a>
                  <a href="https://www.mj.gov.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Ministério da Justiça
                  </a>
                  <a href="https://dre.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                    Diário da República
                  </a>
                </>}
            </div>
          </div>

        </div>
      </div>
    </div>;
};
export default SearchResults;