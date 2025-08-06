import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Comment {
  id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  program_id?: string;
  user_id: string;
}

interface CommentWithProfile extends Comment {
  user_email?: string;
  user_name?: string;
}

const RadioCommentsManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    if (isAdmin) {
      fetchComments();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('admin-comments')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'radio_comments'
          },
          () => {
            fetchComments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // First get the comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('radio_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar comentários",
          variant: "destructive",
        });
        return;
      }

      if (!commentsData) {
        setComments([]);
        return;
      }

      // Then get the user profiles for each comment
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);

      // Combine comments with profile data
      const commentsWithProfiles: CommentWithProfile[] = commentsData.map(comment => {
        const profile = profilesData?.find(p => p.user_id === comment.user_id);
        return {
          ...comment,
          user_email: profile?.email,
          user_name: profile?.full_name
        };
      });

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (commentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('radio_comments')
        .update({ is_approved: !currentStatus })
        .eq('id', commentId);

      if (error) {
        console.error('Error updating comment approval:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar aprovação",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Comentário ${!currentStatus ? 'aprovado' : 'rejeitado'} com sucesso!`,
      });

      fetchComments();
    } catch (error) {
      console.error('Error updating comment approval:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar aprovação",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('radio_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir comentário",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Comentário excluído com sucesso!",
      });

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir comentário",
        variant: "destructive",
      });
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'pending') return !comment.is_approved;
    if (filter === 'approved') return comment.is_approved;
    return true;
  });

  const pendingCount = comments.filter(c => !c.is_approved).length;
  const approvedCount = comments.filter(c => c.is_approved).length;

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Gestão de Comentários
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {comments.length} total
            </Badge>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <Eye className="h-3 w-3" />
                {pendingCount} pendentes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({comments.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendentes ({pendingCount})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Aprovados ({approvedCount})
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum comentário encontrado.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {comment.user_name || comment.user_email || 'Usuário'}
                      </span>
                      <Badge variant={comment.is_approved ? "default" : "secondary"}>
                        {comment.is_approved ? "Aprovado" : "Pendente"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={comment.is_approved}
                        onCheckedChange={() => handleApprovalToggle(comment.id, comment.is_approved)}
                      />
                      {comment.is_approved ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RadioCommentsManagement;