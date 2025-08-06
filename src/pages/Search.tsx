import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import NewsCard from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, RefreshCw, Loader2 } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { NewsService } from "@/services/newsService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("filter") || "Todas");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  
  const { results, loading, search } = useSearch(debouncedQuery, activeFilter);

  // Debounce para busca em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const filter = searchParams.get("filter") || "Todas";
    setSearchQuery(query);
    setActiveFilter(filter);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set("q", query.trim());
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    // Atualizar URL apenas quando há conteúdo significativo
    if (value.length === 0 || value.length > 2) {
      handleSearch(value);
    }
  };

  const handleFilterChange = (filter: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("filter", filter);
    setSearchParams(newParams);
    setActiveFilter(filter);
  };

  const clearSearch = () => {
    setSearchQuery("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <section className="bg-hero py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Digite sua pesquisa..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className="h-12 text-base bg-white/95 border-white/20 focus:bg-white pr-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Button 
              onClick={() => handleSearch(searchQuery)}
              className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-medium"
            >
              <Search className="w-4 h-4 mr-2" />
              Pesquisar
            </Button>
          </div>
          
          {searchQuery && (
            <div className="mt-4">
              <p className="text-hero-foreground/90">
                Resultados da pesquisa para: <strong>"{searchQuery}"</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      <SearchFilters 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Resultados da Pesquisa */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {searchQuery ? `Resultados para "${searchQuery}"` : `Notícias de ${activeFilter === "Todas" ? "Todas as Categorias" : activeFilter}`}
              </h2>
              <div className="flex items-center gap-4">
                <Button onClick={() => search(debouncedQuery, activeFilter)} variant="outline" size="sm" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </Button>
                <span className="text-sm text-muted-foreground">
                  {results.length} notícias encontradas
                </span>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Pesquisando...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {results.length > 0 ? (
                  results.map(newsItem => (
                    <NewsCard 
                      key={newsItem.id} 
                      title={newsItem.title} 
                      category={newsItem.category} 
                      date={NewsService.formatRelativeTime(newsItem.published_at)} 
                      image={newsItem.image_url || "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png"} 
                      excerpt={newsItem.content.substring(0, 150) + "..."} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery ? `Nenhum resultado encontrado para "${searchQuery}".` : "Nenhuma notícia encontrada."}
                    </p>
                    <Button onClick={() => search(debouncedQuery, activeFilter)} variant="outline" className="mt-4">
                      Carregar notícias
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                Tópicos em Destaque
              </h3>
              <div className="space-y-3">
                {(activeFilter === "Imigração" || activeFilter === "Todas") ? (
                  ["Vistos CPLP Portugal", "Autorização de Residência", "Nacionalidade Portuguesa", "AIMA - Processos", "Reagrupamento Familiar"].map((query, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleInputChange(query)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full"
                    >
                      {query}
                    </button>
                  ))
                ) : (
                  ["Código Processo Civil", "Lei do Arrendamento", "Direito do Trabalho", "Tribunal Constitucional", "Código Penal"].map((query, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleInputChange(query)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full"
                    >
                      {query}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold text-foreground mb-4">
                Fontes Oficiais
              </h3>
              <div className="space-y-2 text-sm">
                {(activeFilter === "Imigração" || activeFilter === "Todas") ? (
                  <>
                    <a href="https://www.aima.gov.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                      AIMA - Agência Integração, Migrações e Asilo
                    </a>
                    <a href="https://www.sef.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                      Portal do Cidadão
                    </a>
                    <a href="https://www.portugal.gov.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                      Portal do Governo
                    </a>
                  </>
                ) : (
                  <>
                    <a href="https://www.tribunalconstitucional.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                      Tribunal Constitucional
                    </a>
                    <a href="https://www.mj.gov.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                      Ministério da Justiça
                    </a>
                    <a href="https://dre.pt" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                      Diário da República
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;