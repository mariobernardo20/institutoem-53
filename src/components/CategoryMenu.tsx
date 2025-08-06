import { Link } from "react-router-dom";
interface CategoryMenuProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
const CategoryMenu = ({
  activeFilter,
  onFilterChange
}: CategoryMenuProps) => {
  const categories = ["Imigração", "Direito", "Empreendedorismo", "Ação Social", "Entretenimento", "Espiritualidade", "Negócios", "Tecnologia", "Saúde", "Economia", "Educação"];
  return <div className="bg-background border-b">
      
    </div>;
};
export default CategoryMenu;