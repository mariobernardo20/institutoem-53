import { Link } from "react-router-dom";
interface CategoryMenuProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
const CategoryMenu = ({
  activeFilter,
  onFilterChange
}: CategoryMenuProps) => {
  const categories = ["Todas", "Imigração", "Direito", "Empreendedorismo", "Ação Social", "Entretenimento", "Espiritualidade", "Negócios", "Tecnologia", "Saúde", "Economia", "Educação", "Preços"];
  
  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange(category)}
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
export default CategoryMenu;