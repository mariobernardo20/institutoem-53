import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <section className="bg-hero py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-hero-foreground mb-4">
          Pesquisar Notícias
        </h1>
        <p className="text-lg text-hero-foreground/90 mb-8">
          Encontre as informações que você precisa em nosso arquivo completo
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Digite sua pesquisa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-base bg-white/95 border-white/20 focus:bg-white"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            Pesquisar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;