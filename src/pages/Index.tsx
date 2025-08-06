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
const Index = () => {
  const [activeFilter, setActiveFilter] = useState("Imigração");
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Access Button */}
      <div className="fixed top-4 right-4 z-50">
        
      </div>
      
      <CategoryMenu activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchHero />
      
      {/* Portugal News Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SearchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <SearchResults activeFilter={activeFilter} />
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