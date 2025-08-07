import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { NewsItem } from '@/types/database';

interface OptimizedNewsCardProps {
  news: NewsItem;
  loading?: boolean;
  onImageLoad?: () => void;
}

const OptimizedNewsCard = memo(({ news, loading = false, onImageLoad }: OptimizedNewsCardProps) => {
  const formattedDate = useMemo(() => {
    if (!news.published_at) return '';
    return formatDistanceToNow(new Date(news.published_at), {
      addSuffix: true,
      locale: pt
    });
  }, [news.published_at]);

  const categoryColor = useMemo(() => {
    const colors: Record<string, string> = {
      'Imigração': 'bg-primary text-primary-foreground',
      'Direito': 'bg-blue-500 text-white',
      'Empreendedorismo': 'bg-orange-500 text-white',
      'Tecnologia': 'bg-purple-500 text-white',
      'Saúde': 'bg-green-500 text-white',
      'Educação': 'bg-indigo-500 text-white',
      default: 'bg-muted text-muted-foreground'
    };
    return colors[news.category || ''] || colors.default;
  }, [news.category]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-48 bg-muted rounded-t-lg" />
        <CardHeader>
          <div className="h-4 bg-muted rounded w-20 mb-2" />
          <div className="h-6 bg-muted rounded mb-2" />
          <div className="h-4 bg-muted rounded w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
      {news.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onLoad={onImageLoad}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {news.category && (
            <Badge className={`${categoryColor} text-xs font-medium`}>
              {news.category}
            </Badge>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {formattedDate}
          </div>
        </div>
        
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {news.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        {news.content && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {news.content.substring(0, 120)}...
          </p>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground">
          <User className="w-3 h-3 mr-1" />
          <span>Instituto Empreendedor</span>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedNewsCard.displayName = 'OptimizedNewsCard';

export default OptimizedNewsCard;