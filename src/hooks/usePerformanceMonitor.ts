import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  logInterval?: number;
  componentName?: string;
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const { 
    enabled = process.env.NODE_ENV === 'development',
    logInterval = 10000, // Log every 10 seconds
    componentName = 'Unknown'
  } = options;

  const metrics = useRef<PerformanceMetrics>({
    componentName,
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastUpdate: 0
  });

  const startTime = useRef<number>(0);
  const mounted = useRef<boolean>(false);
  const logTimer = useRef<NodeJS.Timeout>();

  const startMeasure = useCallback(() => {
    if (!enabled) return;
    startTime.current = performance.now();
  }, [enabled]);

  const endMeasure = useCallback(() => {
    if (!enabled || startTime.current === 0) return;
    
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    metrics.current.renderTime = duration;
    metrics.current.updateCount++;
    metrics.current.lastUpdate = Date.now();
    
    if (!mounted.current) {
      metrics.current.mountTime = duration;
      mounted.current = true;
    }
    
    startTime.current = 0;
  }, [enabled]);

  const logMetrics = useCallback(() => {
    if (!enabled) return;
    
    const { componentName, renderTime, mountTime, updateCount, lastUpdate } = metrics.current;
    
    console.group(`🔍 Performance Monitor: ${componentName}`);
    console.log(`📊 Render Time: ${renderTime.toFixed(2)}ms`);
    console.log(`⚡ Mount Time: ${mountTime.toFixed(2)}ms`);
    console.log(`🔄 Update Count: ${updateCount}`);
    console.log(`⏰ Last Update: ${new Date(lastUpdate).toLocaleTimeString()}`);
    console.groupEnd();
  }, [enabled]);

  const getMetrics = useCallback(() => {
    return { ...metrics.current };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Start logging timer
    logTimer.current = setInterval(logMetrics, logInterval);

    return () => {
      if (logTimer.current) {
        clearInterval(logTimer.current);
      }
    };
  }, [enabled, logInterval, logMetrics]);

  // Measure component lifecycle
  useEffect(() => {
    startMeasure();
    return () => {
      endMeasure();
    };
  });

  return {
    startMeasure,
    endMeasure,
    logMetrics,
    getMetrics
  };
}

export default usePerformanceMonitor;