import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Vote, BarChart3, Users } from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description?: string;
  options: string[];
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
}

interface PollWithStats extends Poll {
  votes: PollVote[];
  userVote?: PollVote;
  totalVotes: number;
  optionStats: Array<{
    option: string;
    votes: number;
    percentage: number;
  }>;
}

interface RadioPollsProps {
  programId?: string;
}

const RadioPolls: React.FC<RadioPollsProps> = ({ programId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<PollWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPolls();
    
    // Set up real-time subscription for votes
    const channel = supabase
      .channel('radio-polls')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'radio_poll_votes'
        },
        () => {
          fetchPolls(); // Refetch polls when votes change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [programId]);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      // Fetch active polls
      let pollsQuery = supabase
        .from('radio_polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (programId) {
        pollsQuery = pollsQuery.eq('program_id', programId);
      }

      const { data: pollsData, error: pollsError } = await pollsQuery;

      if (pollsError) {
        console.error('Error fetching polls:', pollsError);
        return;
      }

      if (!pollsData || pollsData.length === 0) {
        setPolls([]);
        return;
      }

      // Fetch all votes for these polls
      const pollIds = pollsData.map(poll => poll.id);
      const { data: votesData } = await supabase
        .from('radio_poll_votes')
        .select('*')
        .in('poll_id', pollIds);

      // Process polls with vote statistics
      const pollsWithStats: PollWithStats[] = pollsData.map(poll => {
        const pollVotes = votesData?.filter(vote => vote.poll_id === poll.id) || [];
        const userVote = user ? pollVotes.find(vote => vote.user_id === user.id) : undefined;
        const totalVotes = pollVotes.length;

        // Calculate statistics for each option
        const options = Array.isArray(poll.options) ? poll.options.map(opt => String(opt)) : [];
        const optionStats = options.map((option: string, index: number) => {
          const votes = pollVotes.filter(vote => vote.option_index === index).length;
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          
          return {
            option,
            votes,
            percentage
          };
        });

        return {
          ...poll,
          options,
          votes: pollVotes,
          userVote,
          totalVotes,
          optionStats
        };
      });

      setPolls(pollsWithStats);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return;
    }

    setVoting(prev => ({ ...prev, [pollId]: true }));

    try {
      const poll = polls.find(p => p.id === pollId);
      
      if (poll?.userVote) {
        // Update existing vote
        const { error } = await supabase
          .from('radio_poll_votes')
          .update({ option_index: optionIndex })
          .eq('id', poll.userVote.id);

        if (error) {
          console.error('Error updating vote:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar voto",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Voto atualizado",
          description: "Seu voto foi atualizado com sucesso!",
        });
      } else {
        // Create new vote
        const { error } = await supabase
          .from('radio_poll_votes')
          .insert({
            poll_id: pollId,
            user_id: user.id,
            option_index: optionIndex
          });

        if (error) {
          console.error('Error submitting vote:', error);
          toast({
            title: "Erro",
            description: "Erro ao enviar voto",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Voto registrado",
          description: "Seu voto foi registrado com sucesso!",
        });
      }

      // Refresh polls to get updated statistics
      fetchPolls();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao votar",
        variant: "destructive",
      });
    } finally {
      setVoting(prev => ({ ...prev, [pollId]: false }));
    }
  };

  const isExpired = (poll: Poll) => {
    if (!poll.expires_at) return false;
    return new Date(poll.expires_at) < new Date();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (polls.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sondagens da Rádio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Não há sondagens ativas no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Sondagens da Rádio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {polls.map((poll) => {
          const expired = isExpired(poll);
          const hasVoted = !!poll.userVote;
          const showResults = hasVoted || expired;

          return (
            <Card key={poll.id} className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{poll.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={expired ? "secondary" : "default"}>
                        {expired ? "Encerrada" : "Ativa"}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {poll.totalVotes}
                      </div>
                    </div>
                  </div>
                  {poll.description && (
                    <p className="text-muted-foreground text-sm mb-4">
                      {poll.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {poll.options.map((option, index) => {
                    const stats = poll.optionStats[index];
                    const isSelected = poll.userVote?.option_index === index;

                    return (
                      <div key={index} className="space-y-2">
                        {showResults ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${isSelected ? 'font-semibold text-primary' : ''}`}>
                                {option}
                                {isSelected && <Vote className="inline ml-2 h-4 w-4" />}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {stats.votes} votos ({stats.percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress 
                              value={stats.percentage} 
                              className="h-2"
                            />
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full justify-start h-auto p-3 text-left"
                            onClick={() => handleVote(poll.id, index)}
                            disabled={voting[poll.id] || expired || !user}
                          >
                            {option}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!user && !showResults && (
                  <p className="text-center text-sm text-muted-foreground">
                    Faça login para votar
                  </p>
                )}

                {poll.expires_at && !expired && (
                  <p className="text-xs text-muted-foreground text-center">
                    Encerra em: {new Date(poll.expires_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RadioPolls;