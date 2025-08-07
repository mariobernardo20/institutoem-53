import React, { memo, useMemo, useCallback } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  containerClassName?: string;
  gap?: number;
}

const VirtualizedList = memo(<T extends { id: string | number }>({
  items,
  renderItem,
  itemHeight = 200,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingComponent,
  emptyComponent,
  containerClassName = "",
  gap = 16
}: VirtualizedListProps<T>) => {
  const { ref: loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: onLoadMore || (() => {}),
    threshold: 0.5,
    rootMargin: '200px'
  });

  const memoizedItems = useMemo(() => items, [items]);

  const renderLoadingSkeleton = useCallback(() => {
    if (loadingComponent) return loadingComponent;
    
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }, [loadingComponent]);

  const renderEmpty = useCallback(() => {
    if (emptyComponent) return emptyComponent;
    
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum item encontrado</p>
      </div>
    );
  }, [emptyComponent]);

  if (loading && memoizedItems.length === 0) {
    return renderLoadingSkeleton();
  }

  if (memoizedItems.length === 0) {
    return renderEmpty();
  }

  return (
    <div className={`h-full ${containerClassName}`}>
      <AutoSizer>
        {({ height, width }) => (
          <div 
            style={{ height, width }}
            className="overflow-auto scrollbar-hide"
          >
            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
                padding: `${gap}px`,
                minHeight: height
              }}
            >
              {memoizedItems.map((item, index) => (
                <div key={item.id} style={{ minHeight: itemHeight }}>
                  {renderItem(item, index)}
                </div>
              ))}
              
              {/* Load more trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="col-span-full">
                  {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-48 rounded-lg" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </AutoSizer>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;