import { useInView } from 'react-intersection-observer';
import { useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px'
}: UseInfiniteScrollProps) => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: false
  });

  const loadMore = useCallback(() => {
    if (hasMore && !loading && inView) {
      onLoadMore();
    }
  }, [hasMore, loading, inView, onLoadMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return {
    ref,
    inView,
    loading: loading && hasMore
  };
};

export default useInfiniteScroll;