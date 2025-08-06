import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Radio, Mail, Database, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  radioName: string;
  radioDescription: string;
  radioFrequency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}

export const SystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "Instituto Empreendedor",
    siteDescription: "Plataforma de conexão para empreendedores portugueses",
    contactEmail: "contato@institutoempreendedor.pt",
    contactPhone: "+351 xxx xxx xxx",
    radioName: "Rádio Instituto Empreendedor",
    radioDescription: "A rádio que inspira empreendedores em Portugal",
    radioFrequency: "FM 105.5",
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    registrationEnabled: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedConfig = localStorage.getItem('system_settings');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('system_settings', JSON.stringify(config));
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SystemConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="radio">Rádio</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={config.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contato</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefone de Contato</Label>
                <Input
                  id="contactPhone"
                  value={config.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Textarea
                id="siteDescription"
                value={config.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="radio" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Configurações da Rádio</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="radioName">Nome da Rádio</Label>
                <Input
                  id="radioName"
                  value={config.radioName}
                  onChange={(e) => handleInputChange('radioName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="radioFrequency">Frequência</Label>
                <Input
                  id="radioFrequency"
                  value={config.radioFrequency}
                  onChange={(e) => handleInputChange('radioFrequency', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="radioDescription">Descrição da Rádio</Label>
              <Textarea
                id="radioDescription"
                value={config.radioDescription}
                onChange={(e) => handleInputChange('radioDescription', e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Configurações de Notificações</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações importantes por email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={config.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações urgentes por SMS
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={config.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Configurações do Sistema</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar página de manutenção para visitantes
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={config.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registrationEnabled">Registros Habilitados</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir novos registros de candidatos
                  </p>
                </div>
                <Switch
                  id="registrationEnabled"
                  checked={config.registrationEnabled}
                  onCheckedChange={(checked) => handleInputChange('registrationEnabled', checked)}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4" />
                <h4 className="font-medium">Banco de Dados</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Configurações temporárias - Em breve com integração completa do Supabase
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  Backup de Dados
                </Button>
                <Button variant="outline" size="sm">
                  Limpar Cache
                </Button>
                <Button variant="outline" size="sm">
                  Ver Logs
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};