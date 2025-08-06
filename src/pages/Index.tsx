import { useState } from "react";
import Header from "@/components/Header";
import CategoryMenu from "@/components/CategoryMenu";
import SearchHero from "@/components/SearchHero";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";
import RadioPlayer from "@/components/RadioPlayer";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("Imigração");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryMenu activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchHero />
      <SearchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SearchResults activeFilter={activeFilter} />
      <Footer />
    </div>
  );
};

export default Index;
