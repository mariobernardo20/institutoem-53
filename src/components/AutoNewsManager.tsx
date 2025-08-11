// Component for managing automatic news updates in admin panel
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAutoNews } from "@/hooks/useAutoNews";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Play, 
  Square, 
  RefreshCw, 
  Activity, 
  FileText, 
  Clock,
  TrendingUp,
  Database
} from "lucide-react";

const AutoNewsManager = () => {
  const {
    isRunning,
    stats,
    isUpdating,
    lastManualUpdate,
    startAutoFetch,
    stopAutoFetch,
    manualUpdate,
    refreshStats
  } = useAutoNews();

  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sistema de Busca Automática de Notícias
              </CardTitle>
              <CardDescription>
                Gerencie a busca automática e indexação de notícias
              </CardDescription>
            </div>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={isRunning ? stopAutoFetch : startAutoFetch}
              variant={isRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4" />
                  Parar Sistema
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Iniciar Sistema
                </>
              )}
            </Button>
            
            <Button
              onClick={manualUpdate}
              disabled={isUpdating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
              {isUpdating ? "Atualizando..." : "Atualizar Agora"}
            </Button>
            
            <Button
              onClick={refreshStats}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Atualizar Stats
            </Button>
          </div>

          {lastManualUpdate && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Última atualização manual: {formatLastUpdate(lastManualUpdate)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Articles */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats.totalArticles}
              </div>
              <div className="text-sm text-muted-foreground">
                Total de Artigos
              </div>
            </div>

            {/* Last Update */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium">
                {formatLastUpdate(stats.lastUpdate)}
              </div>
              <div className="text-sm text-muted-foreground">
                Última Atualização
              </div>
            </div>

            {/* System Status */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className={`text-sm font-medium ${isRunning ? 'text-green-600' : 'text-gray-500'}`}>
                {isRunning ? "Sistema Ativo" : "Sistema Inativo"}
              </div>
              <div className="text-sm text-muted-foreground">
                Status do Sistema
              </div>
            </div>
          </div>

          <Separator />

          {/* Articles by Category */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Artigos por Categoria
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stats.articlesByCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-muted rounded">
                  <span className="font-medium">{category}</span>
                  <Badge variant="outline">{count} artigos</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p>• <strong>Busca Automática:</strong> O sistema busca notícias a cada 6 horas de fontes confiáveis</p>
            <p>• <strong>Filtragem Inteligente:</strong> Usa palavras-chave específicas para cada categoria</p>
            <p>• <strong>Prevenção de Duplicatas:</strong> Verifica se a notícia já existe antes de adicionar</p>
            <p>• <strong>Limpeza Automática:</strong> Remove artigos antigos para manter a base otimizada</p>
            <p>• <strong>Fontes Reais:</strong> Integra com APIs de notícias portuguesas quando disponível</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoNewsManager;