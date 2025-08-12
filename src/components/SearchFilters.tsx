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
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          onClick={() => handleFilterChange(filter)}
          className="text-sm"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};
export default SearchFilters;