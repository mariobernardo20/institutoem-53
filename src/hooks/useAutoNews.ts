// Hook for managing automatic news updates
import { useState, useEffect, useCallback } from "react";
import { AutoNewsService } from "@/services/autoNewsService";
import { useToast } from "@/components/ui/use-toast";

interface NewsStats {
  totalArticles: number;
  articlesByCategory: Record<string, number>;
  lastUpdate: string | null;
}

interface AutoNewsState {
  isRunning: boolean;
  stats: NewsStats;
  isUpdating: boolean;
  lastManualUpdate: string | null;
}

export const useAutoNews = () => {
  const [state, setState] = useState<AutoNewsState>({
    isRunning: false,
    stats: {
      totalArticles: 0,
      articlesByCategory: {},
      lastUpdate: null
    },
    isUpdating: false,
    lastManualUpdate: null
  });

  const { toast } = useToast();

  // Load initial stats
  const loadStats = useCallback(async () => {
    try {
      const stats = await AutoNewsService.getNewsStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      console.error("Failed to load news stats:", error);
    }
  }, []);

  // Start automatic news fetching
  const startAutoFetch = useCallback(() => {
    AutoNewsService.startAutoFetch();
    setState(prev => ({ ...prev, isRunning: true }));
    
    toast({
      title: "Sistema Automático Ativado",
      description: "O sistema de busca automática de notícias foi iniciado.",
    });
  }, [toast]);

  // Stop automatic news fetching
  const stopAutoFetch = useCallback(() => {
    AutoNewsService.stopAutoFetch();
    setState(prev => ({ ...prev, isRunning: false }));
    
    toast({
      title: "Sistema Automático Desativado",
      description: "O sistema de busca automática de notícias foi parado.",
    });
  }, [toast]);

  // Manual update
  const manualUpdate = useCallback(async () => {
    setState(prev => ({ ...prev, isUpdating: true }));
    
    try {
      const result = await AutoNewsService.manualUpdate();
      
      if (result.success) {
        toast({
          title: "Atualização Concluída",
          description: `${result.articlesAdded} novos artigos foram adicionados.`,
        });
      } else {
        toast({
          title: "Erro na Atualização",
          description: result.message,
          variant: "destructive",
        });
      }

      // Reload stats after update
      await loadStats();
      
      setState(prev => ({ 
        ...prev, 
        isUpdating: false,
        lastManualUpdate: new Date().toISOString()
      }));
      
    } catch (error) {
      toast({
        title: "Erro na Atualização",
        description: "Falha ao atualizar notícias. Tente novamente.",
        variant: "destructive",
      });
      
      setState(prev => ({ ...prev, isUpdating: false }));
    }
  }, [toast, loadStats]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Periodically reload stats
  useEffect(() => {
    const interval = setInterval(loadStats, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [loadStats]);

  return {
    ...state,
    startAutoFetch,
    stopAutoFetch,
    manualUpdate,
    refreshStats: loadStats
  };
};