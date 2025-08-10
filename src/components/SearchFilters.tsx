import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilter,
  onFilterChange
}) => {
  const navigate = useNavigate();
  const filters = ["Todas", "Imigração", "Direito", "Empreendedorismo", "Ação Social", "Entretenimento", "Espiritualidade", "Negócios", "Tecnologia", "Saúde", "Economia", "Educação", "Preços"];
  const handleFilterChange = (filter: string) => {
    if (filter === "Preços") {
      navigate("/precos");
    } else {
      onFilterChange(filter);
    }
  };

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchFilters;