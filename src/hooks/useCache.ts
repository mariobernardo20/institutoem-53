import { useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface UseCacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
}

export function useCache<T>(options: UseCacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // Default 5 minutes TTL
  const cache = useRef(new Map<string, CacheEntry<T>>());
  const [cacheSize, setCacheSize] = useState(0);

  const set = useCallback((key: string, data: T, customTtl?: number) => {
    const currentCache = cache.current;
    
    // Remove expired entries if cache is getting full
    if (currentCache.size >= maxSize) {
      const now = Date.now();
      const keysToDelete: string[] = [];
      
      currentCache.forEach((entry, entryKey) => {
        if (now - entry.timestamp > entry.ttl) {
          keysToDelete.push(entryKey);
        }
      });
      
      keysToDelete.forEach(keyToDelete => {
        currentCache.delete(keyToDelete);
      });
      
      // If still at capacity, remove oldest entry
      if (currentCache.size >= maxSize) {
        const oldestKey = currentCache.keys().next().value;
        if (oldestKey) {
          currentCache.delete(oldestKey);
        }
      }
    }

    currentCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    });
    
    setCacheSize(currentCache.size);
  }, [ttl, maxSize]);

  const get = useCallback((key: string): T | null => {
    const currentCache = cache.current;
    const entry = currentCache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      currentCache.delete(key);
      setCacheSize(currentCache.size);
      return null;
    }
    
    return entry.data;
  }, []);

  const remove = useCallback((key: string): boolean => {
    const currentCache = cache.current;
    const deleted = currentCache.delete(key);
    if (deleted) {
      setCacheSize(currentCache.size);
    }
    return deleted;
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
    setCacheSize(0);
  }, []);

  const has = useCallback((key: string): boolean => {
    const currentCache = cache.current;
    const entry = currentCache.get(key);
    
    if (!entry) {
      return false;
    }
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      currentCache.delete(key);
      setCacheSize(currentCache.size);
      return false;
    }
    
    return true;
  }, []);

  const stats = useCallback(() => ({
    size: cacheSize,
    maxSize,
    entries: Array.from(cache.current.keys())
  }), [cacheSize, maxSize]);

  return {
    set,
    get,
    remove,
    clear,
    has,
    stats
  };
}

export default useCache;