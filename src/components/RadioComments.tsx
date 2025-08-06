import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

interface RadioCommentsProps {
  programId?: string;
}

const RadioComments: React.FC<RadioCommentsProps> = ({ programId }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('radio-comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'radio_comments'
        },
        (payload) => {
          console.log('New comment:', payload);
          fetchComments(); // Refetch to get user profile data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [programId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // First get comments
      let commentsQuery = supabase
        .from('radio_comments')
        .select('id, content, created_at, user_id')
        .order('created_at', { ascending: false });

      if (programId) {
        commentsQuery = commentsQuery.eq('program_id', programId);
      }

      const { data: commentsData, error: commentsError } = await commentsQuery;

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar comentários",
          variant: "destructive",
        });
        return;
      }

      // Then get profiles for each comment
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', comment.user_id)
            .maybeSingle();

          return {
            ...comment,
            profiles: profileData || { full_name: 'Usuário', avatar_url: null }
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Comentário vazio",
        description: "Por favor, escreva um comentário",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('radio_comments')
        .insert({
          content: newComment.trim(),
          user_id: user.id,
          program_id: programId
        });

      if (error) {
        console.error('Error submitting comment:', error);
        toast({
          title: "Erro",
          description: "Erro ao enviar comentário",
          variant: "destructive",
        });
        return;
      }

      setNewComment('');
      toast({
        title: "Sucesso",
        description: "Comentário enviado com sucesso!",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao enviar comentário",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comentários da Rádio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-2">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  className="min-h-[80px]"
                  disabled={submitting}
                />
                <Button 
                  type="submit" 
                  className="mt-2" 
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground">
              Faça login para comentar
            </p>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : comments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Ainda não há comentários. Seja o primeiro a comentar!
              </p>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar_url} />
                    <AvatarFallback>
                      {comment.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.profiles?.full_name || 'Usuário'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioComments;