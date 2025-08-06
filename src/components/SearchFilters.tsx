import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const SearchFilters = ({ activeFilter, onFilterChange }: SearchFiltersProps) => {
  const navigate = useNavigate();
  
  const filters = [
    "Todas",
    "Imigração",
    "Direito",
    "Empreendedorismo",
    "Ação Social",
    "Entretenimento",
    "Espiritualidade",
    "Negócios",
    "Tecnologia",
    "Saúde",
    "Economia",
    "Educação",
    "Preços",
  ];

  const handleFilterChange = (filter: string) => {
    if (filter === "Preços") {
      navigate("/precos");
    } else {
      onFilterChange(filter);
    }
  };

  return (
    <div className="bg-background border-b py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <span className="text-sm font-medium text-foreground">Filtrar por:</span>
          
          {/* Desktop filters */}
          <div className="hidden lg:flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(filter)}
                className="text-sm"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Mobile filter dropdown */}
          <div className="lg:hidden w-full max-w-xs">
            <Select value={activeFilter} onValueChange={handleFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter} value={filter}>
                    {filter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort dropdown */}
          <div className="ml-auto">
            <Select defaultValue="relevant">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Mais relevantes</SelectItem>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;