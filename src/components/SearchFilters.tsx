import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
const SearchFilters = ({
  activeFilter,
  onFilterChange
}: SearchFiltersProps) => {
  const navigate = useNavigate();
  const filters = ["Todas", "Imigração", "Direito", "Empreendedorismo", "Ação Social", "Entretenimento", "Espiritualidade", "Negócios", "Tecnologia", "Saúde", "Economia", "Educação", "Preços"];
  const handleFilterChange = (filter: string) => {
    if (filter === "Preços") {
      navigate("/precos");
    } else {
      onFilterChange(filter);
    }
  };
  return;
};
export default SearchFilters;