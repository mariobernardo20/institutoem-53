import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import Header from "@/components/Header";
import CategoryMenu from "@/components/CategoryMenu";
import SearchHero from "@/components/SearchHero";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";
import RadioPlayer from "@/components/RadioPlayer";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("Imigração");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Access Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin-login")}
          className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20"
        >
          <Shield className="h-4 w-4" />
          Admin
        </Button>
      </div>
      
      <CategoryMenu activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchHero />
      <SearchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchResults activeFilter={activeFilter} />
      <Footer />
    </div>
  );
};

export default Index;
