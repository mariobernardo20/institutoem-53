import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
  is_approved: boolean;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface OptimizedRadioCommentsProps {
  programId?: string;
}

const OptimizedRadioComments: React.FC<OptimizedRadioCommentsProps> = ({ programId }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Memoize approved comments
  const approvedComments = useMemo(() => {
    return comments.filter(comment => comment.is_approved);
  }, [comments]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      // Only fetch approved comments (RLS policies now protect user emails)
      const { data: commentsData, error: commentsError } = await supabase
        .from('radio_comments')
        .select('id, content, created_at, user_id, user_name, is_approved')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to latest 50 comments

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar comentários",
          variant: "destructive",
        });
        return;
      }

      // Batch fetch profiles for better performance
      const userIds = [...new Set(commentsData?.map(c => c.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', userIds);

        profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, any>);
      }

      // Combine comments with profiles
      const commentsWithProfiles = (commentsData || []).map(comment => ({
        ...comment,
        profiles: profilesMap[comment.user_id] || { 
          full_name: comment.user_name || 'Usuário', 
          avatar_url: null 
        }
      }));

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchComments();
    
    // Optimized real-time subscription
    const channel = supabase
      .channel('radio-comments-optimized')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'radio_comments',
          filter: 'is_approved=eq.true'
        },
        () => {
          // Debounced refetch
          setTimeout(fetchComments, 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchComments]);

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
          user_name: profile?.full_name || user.email || 'Usuário',
          // user_email removed for security
          is_approved: false // Comments need approval
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
        title: "Comentário enviado",
        description: "Seu comentário será analisado antes de aparecer publicamente",
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
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comentários da Rádio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-2 flex-shrink-0">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva seu comentário sobre a rádio..."
                  className="min-h-[80px] resize-none"
                  disabled={submitting}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {newComment.length}/500 caracteres
                  </span>
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={submitting || !newComment.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-3 w-3" />
                    {submitting ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Comentários são moderados antes de aparecer publicamente
                </p>
              </div>
            </div>
          </form>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Faça login para comentar sobre a rádio
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : approvedComments.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Ainda não há comentários aprovados. Seja o primeiro a comentar!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {approvedComments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={comment.profiles?.avatar_url} />
                        <AvatarFallback>
                          {comment.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium text-sm">
                            {comment.profiles?.full_name || comment.user_name || 'Usuário'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedRadioComments;