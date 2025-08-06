import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'hours' | 'emergency';
  title: string;
  content: string;
  sub_content?: string;
  icon: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

const ContactManagement = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'messages'>('info');
  const [editingInfo, setEditingInfo] = useState<ContactInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "email" as 'email' | 'phone' | 'address' | 'hours' | 'emergency',
    title: "",
    content: "",
    sub_content: "",
    icon: "",
    display_order: 1,
    status: "active" as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchContactInfo();
    fetchContactMessages();
  }, []);

  const fetchContactInfo = async () => {
    try {
      // Simular dados para demonstração
      const mockContactInfo: ContactInfo[] = [
        {
          id: "1",
          type: "email",
          title: "Email",
          content: "info@institutoemprendedor.pt",
          sub_content: "Resposta em 24 horas",
          icon: "Mail",
          display_order: 1,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setContactInfo(mockContactInfo);
    } catch (error) {
      console.error('Erro ao buscar informações de contacto:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar informações de contacto",
        variant: "destructive"
      });
    }
  };

  const fetchContactMessages = async () => {
    try {
      // Simular dados para demonstração
      const mockMessages: ContactMessage[] = [
        {
          id: "1",
          name: "João Silva",
          email: "joao@email.com",
          subject: "Consulta sobre imigração",
          message: "Gostaria de saber mais sobre os processos de imigração para Portugal.",
          status: "unread",
          created_at: new Date().toISOString()
        }
      ];
      setContactMessages(mockMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simular salvamento
      toast({
        title: "Sucesso",
        description: editingInfo ? "Informação atualizada com sucesso!" : "Nova informação criada com sucesso!"
      });

      resetForm();
      fetchContactInfo();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar informação",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (info: ContactInfo) => {
    setEditingInfo(info);
    setFormData({
      type: info.type,
      title: info.title,
      content: info.content,
      sub_content: info.sub_content || "",
      icon: info.icon,
      display_order: info.display_order,
      status: info.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (infoId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta informação?')) return;

    try {
      // Simular exclusão
      toast({
        title: "Sucesso",
        description: "Informação excluída com sucesso!"
      });
      
      fetchContactInfo();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir informação",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      // Simular marcação como lida
      setContactMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' as const } : msg
        )
      );
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao marcar como lida",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: "email",
      title: "",
      content: "",
      sub_content: "",
      icon: "",
      display_order: 1,
      status: "active"
    });
    setEditingInfo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT');
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Mail': return <Mail className="h-4 w-4" />;
      case 'Phone': return <Phone className="h-4 w-4" />;
      case 'MapPin': return <MapPin className="h-4 w-4" />;
      case 'Clock': return <Clock className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'destructive';
      case 'read': return 'secondary';
      case 'replied': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'Não lida';
      case 'read': return 'Lida';
      case 'replied': return 'Respondida';
      default: return status;
    }
  };

  if (loading) {
    return <div className="text-center">Carregando informações de contacto...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Contactos</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'info' ? 'default' : 'outline'}
            onClick={() => setActiveTab('info')}
          >
            Informações
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
          >
            Mensagens ({contactMessages.filter(m => m.status === 'unread').length})
          </Button>
        </div>
      </div>

      {activeTab === 'info' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Informação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingInfo ? 'Editar Informação' : 'Nova Informação de Contacto'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo *</Label>
                      <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="address">Endereço</SelectItem>
                          <SelectItem value="hours">Horário</SelectItem>
                          <SelectItem value="emergency">Emergência</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="icon">Ícone *</Label>
                      <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mail">Mail</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="MapPin">MapPin</SelectItem>
                          <SelectItem value="Clock">Clock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Input
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sub_content">Sub-conteúdo</Label>
                    <Input
                      id="sub_content"
                      value={formData.sub_content}
                      onChange={(e) => setFormData({...formData, sub_content: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="display_order">Ordem de Exibição *</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingInfo ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {contactInfo.map((info) => (
              <Card key={info.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getIconComponent(info.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{info.title}</CardTitle>
                        <p className="text-muted-foreground">{info.content}</p>
                        {info.sub_content && (
                          <p className="text-sm text-muted-foreground">{info.sub_content}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={info.status === 'active' ? 'default' : 'secondary'}>
                        {info.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(info)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(info.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {contactInfo.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma informação cadastrada</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-4">
          {contactMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <p className="text-muted-foreground">{message.name} • {message.email}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(message.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(message.status)}>
                      {getStatusLabel(message.status)}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedMessage(message);
                        setIsMessageDialogOpen(true);
                        if (message.status === 'unread') {
                          handleMarkAsRead(message.id);
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
              </CardContent>
            </Card>
          ))}

          {contactMessages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma mensagem recebida</p>
            </div>
          )}
        </div>
      )}

      {/* Message Details Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Mensagem</DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <p className="text-sm">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
              </div>
              
              <div>
                <Label>Assunto</Label>
                <p className="text-sm">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <Label>Mensagem</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div>
                <Label>Data de Envio</Label>
                <p className="text-sm">{formatDate(selectedMessage.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactManagement;