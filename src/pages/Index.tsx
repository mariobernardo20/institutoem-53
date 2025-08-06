import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Shield, Users, FileText, Radio, TrendingUp, Calendar, Star } from "lucide-react";
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
      
      {/* Hero Section with Enhanced Design */}
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        
      </div>
      
      {/* Main Content Section with Better Organization */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Featured Content */}
              <div className="lg:col-span-2">
                <FeaturedContent />
              </div>
            </div>

            {/* Services Overview */}
            

            {/* Search Section */}
            <div className="bg-white rounded-lg border p-6">
              
              <SearchFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              <SearchResults activeFilter={activeFilter} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <PortugalNews />
            
            {/* Quick Actions */}
            <Card>
              
              
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Index;