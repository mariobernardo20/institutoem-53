import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, UserX, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
    getCurrentUser();
    
    // Setup realtime subscription
    const subscription = supabase
      .channel('admin_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles',
        filter: 'role=in.(admin,super_admin)'
      }, () => {
        fetchAdmins();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(profile);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'super_admin'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar administradores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAdminRole = async (adminId: string, newRole: 'admin' | 'super_admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cargo do administrador atualizado",
      });
      
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cargo",
        variant: "destructive"
      });
    }
  };

  const deleteAdmin = async (adminId: string) => {
    try {
      // Check if user is trying to delete themselves
      if (adminId === currentUser?.id) {
        toast({
          title: "Erro",
          description: "Não pode excluir sua própria conta",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Administrador removido com sucesso",
      });
      
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover administrador",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
      return <Badge className="bg-green-100 text-green-800">Novo</Badge>;
    } else if (diffInDays < 30) {
      return <Badge variant="secondary">Ativo</Badge>;
    } else {
      return <Badge variant="outline">Antigo</Badge>;
    }
  };

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('pt-BR');
  };

  const getRoleIcon = (role: string) => {
    return role === 'super_admin' ? <Shield className="h-4 w-4 text-purple-600" /> : <Users className="h-4 w-4 text-blue-600" />;
  };

  const canDeleteAdmin = () => {
    return currentUser?.role === 'super_admin';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando administradores...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestão de Administradores
          <Badge variant="outline" className="ml-auto">
            {admins.length} {admins.length === 1 ? 'Admin' : 'Admins'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {admin.full_name?.slice(0, 2).toUpperCase() || admin.email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{admin.full_name || admin.email}</h3>
                      {getRoleIcon(admin.role)}
                      {getStatusBadge(admin.created_at)}
                    </div>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Admin desde: {formatCreatedAt(admin.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canDeleteAdmin() && admin.id !== currentUser?.id && (
                    <Select
                      value={admin.role}
                      onValueChange={(value: 'admin' | 'super_admin') => updateAdminRole(admin.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {admin.id !== currentUser?.id && (
                    <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </Badge>
                  )}

                  {admin.id === currentUser?.id && (
                    <Badge variant="outline">Você</Badge>
                  )}

                  {canDeleteAdmin() && admin.id !== currentUser?.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Administrador</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover <strong>{admin.full_name || admin.email}</strong> 
                            do cargo de administrador? Esta ação transformará o usuário em usuário comum.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteAdmin(admin.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          ))}

          {admins.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum administrador encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};