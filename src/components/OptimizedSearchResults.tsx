import React, { memo, useMemo } from 'react';
import { useNews, useNewsFilter, useNewsLoading } from '@/stores/newsStore';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import OptimizedNewsCard from './OptimizedNewsCard';
import VirtualizedList from './VirtualizedList';

interface OptimizedSearchResultsProps {
  maxItems?: number;
  enableVirtualization?: boolean;
}

const OptimizedSearchResults = memo(({ 
  maxItems = 20,
  enableVirtualization = true 
}: OptimizedSearchResultsProps) => {
  usePerformanceMonitor({ componentName: 'OptimizedSearchResults' });
  
  const news = useNews();
  const activeFilter = useNewsFilter();
  const loading = useNewsLoading();

  // Paginated results
  const paginatedNews = useMemo(() => {
    return news.slice(0, maxItems);
  }, [news, maxItems]);

  const hasMore = useMemo(() => {
    return news.length > maxItems;
  }, [news.length, maxItems]);

  const { ref: loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: () => {
      // This would typically update the store to load more items
      console.log('Loading more news items...');
    }
  });

  const renderNewsItem = useMemo(() => 
    (item: any, index: number) => (
      <OptimizedNewsCard 
        key={item.id} 
        news={item}
        loading={false}
      />
    ), []
  );

  if (loading && paginatedNews.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <OptimizedNewsCard key={index} news={{} as any} loading={true} />
        ))}
      </div>
    );
  }

  if (paginatedNews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhuma notícia encontrada para "{activeFilter}"
        </p>
      </div>
    );
  }

  if (enableVirtualization && paginatedNews.length > 10) {
    return (
      <div className="mt-6" style={{ height: '600px' }}>
        <VirtualizedList
          items={paginatedNews}
          renderItem={renderNewsItem}
          itemHeight={300}
          loading={loading}
          hasMore={hasMore}
          containerClassName="rounded-lg border"
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((item, index) => (
          <OptimizedNewsCard 
            key={item.id} 
            news={item}
            loading={false}
          />
        ))}
      </div>
      
      {hasMore && (
        <div ref={loadMoreRef} className="mt-8">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <OptimizedNewsCard key={index} news={{} as any} loading={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

OptimizedSearchResults.displayName = 'OptimizedSearchResults';

export default OptimizedSearchResults;