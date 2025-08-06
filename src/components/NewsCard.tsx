import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt?: string;
}

const NewsCard = ({ title, category, date, image, excerpt }: NewsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <Badge 
                variant="default" 
                className="bg-primary text-primary-foreground text-xs font-semibold"
              >
                {category.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Há {date}
              </span>
            </div>
            <h3 className="font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;