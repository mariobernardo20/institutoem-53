import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Plus, Shield, User, Mail, Clock, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface AdminInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by: string;
}

interface AuditLog {
  id: string;
  action: string;
  target_type?: string;
  details?: any;
  created_at: string;
  admin_id: string;
  profiles?: {
    full_name: string;
  };
}

const AdminUsersManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newInviteData, setNewInviteData] = useState({
    email: "",
    role: "admin",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    setupRealtimeSubscriptions();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchAdminUsers(),
        fetchInvitations(),
        fetchAuditLogs()
      ]);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setAdminUsers(data || []);
  };

  const fetchInvitations = async () => {
    const { data, error } = await supabase
      .from("admin_invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setInvitations(data || []);
  };

  const fetchAuditLogs = async () => {
    const { data, error } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    setAuditLogs(data || []);
  };

  const setupRealtimeSubscriptions = () => {
    const adminUsersChannel = supabase
      .channel('admin_users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'admin_users' },
        () => fetchAdminUsers()
      )
      .subscribe();

    const invitationsChannel = supabase
      .channel('invitations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'admin_invitations' },
        () => fetchInvitations()
      )
      .subscribe();

    const auditLogsChannel = supabase
      .channel('audit_logs_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'admin_audit_logs' },
        () => fetchAuditLogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminUsersChannel);
      supabase.removeChannel(invitationsChannel);
      supabase.removeChannel(auditLogsChannel);
    };
  };

  const sendInvitation = async () => {
    if (!newInviteData.email) {
      toast({
        title: "Erro",
        description: "Email é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', currentUser.user?.id)
        .single();

      const { data, error } = await supabase.functions.invoke('send-admin-invite', {
        body: {
          email: newInviteData.email,
          role: newInviteData.role,
          invitedByName: currentProfile?.full_name || 'Administrador'
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Convite enviado com sucesso!",
      });

      setDialogOpen(false);
      setNewInviteData({
        email: "",
        role: "admin",
      });
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao enviar convite: " + error.message,
        variant: "destructive",
      });
    }
  };

  const updateAdminStatus = async (adminId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("admin_users")
        .update({ status: newStatus })
        .eq("id", adminId);

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_admin_action', {
        p_action: 'admin_status_updated',
        p_target_type: 'admin_user',
        p_target_id: adminId,
        p_details: { new_status: newStatus }
      });

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });

      fetchAdminUsers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteAdminUser = async (adminId: string) => {
    try {
      const adminUser = adminUsers.find(admin => admin.id === adminId);
      
      const { error } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", adminId);

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_admin_action', {
        p_action: 'admin_deleted',
        p_target_type: 'admin_user',
        p_target_id: adminId,
        p_details: { deleted_admin: adminUser?.email }
      });

      toast({
        title: "Sucesso",
        description: "Administrador removido com sucesso!",
      });

      fetchAdminUsers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao remover administrador: " + error.message,
        variant: "destructive",
      });
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("admin_invitations")
        .update({ status: 'cancelled' })
        .eq("id", invitationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Convite cancelado com sucesso!",
      });

      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao cancelar convite: " + error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Ativo", variant: "default" as const },
      inactive: { label: "Inativo", variant: "secondary" as const },
      suspended: { label: "Suspenso", variant: "destructive" as const },
      pending: { label: "Pendente", variant: "outline" as const },
      accepted: { label: "Aceito", variant: "default" as const },
      expired: { label: "Expirado", variant: "destructive" as const },
      cancelled: { label: "Cancelado", variant: "secondary" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      admin: { label: "Admin", variant: "secondary" as const, icon: User },
      super_admin: { label: "Super Admin", variant: "default" as const, icon: Shield },
    };
    const roleInfo = roleMap[role as keyof typeof roleMap] || { label: role, variant: "outline" as const, icon: User };
    const Icon = roleInfo.icon;
    return (
      <Badge variant={roleInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {roleInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const getActionDescription = (action: string) => {
    const actionMap: Record<string, string> = {
      'admin_invite_sent': 'Enviou convite de administrador',
      'admin_invite_accepted': 'Aceitou convite de administrador',
      'admin_status_updated': 'Atualizou status de administrador',
      'admin_deleted': 'Removeu administrador',
      'login_success': 'Login realizado',
      'login_failed': 'Tentativa de login falhada',
    };
    return actionMap[action] || action;
  };

  const filteredAdminUsers = adminUsers.filter(admin => {
    const matchesSearch = admin.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = invitation.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gerenciamento de Administradores</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Convite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Convite de Administrador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newInviteData.email}
                    onChange={(e) => setNewInviteData({ ...newInviteData, email: e.target.value })}
                    placeholder="admin@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select value={newInviteData.role} onValueChange={(value) => setNewInviteData({ ...newInviteData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="super_admin">Super Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={sendInvitation} className="w-full">
                  Enviar Convite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="administrators" className="w-full">
          <TabsList>
            <TabsTrigger value="administrators">Administradores ({adminUsers.length})</TabsTrigger>
            <TabsTrigger value="invitations">Convites ({invitations.length})</TabsTrigger>
            <TabsTrigger value="audit">Log de Auditoria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="administrators">
            {filteredAdminUsers.length === 0 ? (
              <p className="text-muted-foreground">Nenhum administrador encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{admin.full_name}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(admin.role)}</TableCell>
                      <TableCell>{getStatusBadge(admin.status)}</TableCell>
                      <TableCell>{formatDate(admin.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Select value={admin.status} onValueChange={(value) => updateAdminStatus(admin.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
                              <SelectItem value="suspended">Suspenso</SelectItem>
                            </SelectContent>
                          </Select>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover este administrador? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteAdminUser(admin.id)}>
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="invitations">
            {filteredInvitations.length === 0 ? (
              <p className="text-muted-foreground">Nenhum convite encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(invitation.expires_at)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(invitation.created_at)}</TableCell>
                      <TableCell>
                        {invitation.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => cancelInvitation(invitation.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="audit">
            {auditLogs.length === 0 ? (
              <p className="text-muted-foreground">Nenhum log de auditoria encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.profiles?.full_name || 'Sistema'}</TableCell>
                      <TableCell>{getActionDescription(log.action)}</TableCell>
                      <TableCell>
                        {log.details && (
                          <div className="text-sm text-muted-foreground">
                            {JSON.stringify(log.details, null, 2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(log.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminUsersManagement;