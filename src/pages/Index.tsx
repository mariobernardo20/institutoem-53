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
import { PortugalNews } from "@/components/PortugalNews";
import { QuickStats } from "@/components/QuickStats";
import { FeaturedContent } from "@/components/FeaturedContent";
const Index = () => {
  const [activeFilter, setActiveFilter] = useState("Imigração");
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Radio Player - Fixed Position */}
      <div className="fixed bottom-4 right-4 z-50">
        <RadioPlayer />
      </div>
      
      <CategoryMenu activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchHero />
      
      {/* Quick Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <QuickStats />
      </div>
      
      {/* Main Content Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FeaturedContent />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Buscar por Categoria</h2>
              <SearchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              <SearchResults activeFilter={activeFilter} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <PortugalNews />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Index;