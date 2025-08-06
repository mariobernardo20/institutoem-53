import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, UserCheck, UserX, Shield } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

interface NewAdminData {
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'super_admin';
}

const AdminUsersManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdminData>({
    email: "",
    full_name: "",
    password: "",
    role: "admin"
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers((data || []).map(admin => ({
        ...admin,
        role: admin.role as 'admin' | 'super_admin',
        status: admin.status as 'active' | 'inactive' | 'suspended'
      })));
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários administrativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdminUser = async () => {
    if (!newAdmin.email || !newAdmin.full_name || !newAdmin.password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: {
          data: {
            full_name: newAdmin.full_name,
            role: newAdmin.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create admin user record
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            user_id: authData.user.id,
            email: newAdmin.email,
            full_name: newAdmin.full_name,
            role: newAdmin.role,
            created_by: user?.id
          });

        if (adminError) throw adminError;

        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            email: newAdmin.email,
            full_name: newAdmin.full_name,
            role: newAdmin.role
          });

        if (profileError) throw profileError;

        toast({
          title: "Sucesso",
          description: "Usuário administrativo criado com sucesso"
        });

        setNewAdmin({ email: "", full_name: "", password: "", role: "admin" });
        setDialogOpen(false);
        fetchAdminUsers();
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário administrativo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAdminStatus = async (adminId: string, status: 'active' | 'inactive' | 'suspended') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do usuário atualizado com sucesso"
      });

      fetchAdminUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do usuário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAdminUser = async (adminId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário administrativo removido com sucesso"
      });

      fetchAdminUsers();
    } catch (error) {
      console.error('Error deleting admin user:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover usuário administrativo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive"
    } as const;

    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      suspended: "Suspenso"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === 'super_admin' ? "default" : "outline"}>
        <Shield className="h-3 w-3 mr-1" />
        {role === 'super_admin' ? 'Super Admin' : 'Admin'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciamento de Administradores</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Administrador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={newAdmin.full_name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                    placeholder="Nome completo do administrador"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="Senha mínima de 6 caracteres"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={newAdmin.role}
                    onValueChange={(value: 'admin' | 'super_admin') => 
                      setNewAdmin({ ...newAdmin, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="super_admin">Super Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={createAdminUser} disabled={loading}>
                    {loading ? "Criando..." : "Criar Admin"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading && adminUsers.length === 0 ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.full_name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell>{getStatusBadge(admin.status)}</TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={admin.status}
                        onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                          updateAdminStatus(admin.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Ativo
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center">
                              <UserX className="h-4 w-4 mr-2" />
                              Inativo
                            </div>
                          </SelectItem>
                          <SelectItem value="suspended">
                            <div className="flex items-center">
                              <UserX className="h-4 w-4 mr-2" />
                              Suspenso
                            </div>
                          </SelectItem>
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
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover o administrador {admin.full_name}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAdminUser(admin.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {adminUsers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum administrador encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsersManagement;