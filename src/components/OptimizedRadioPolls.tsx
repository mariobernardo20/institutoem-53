import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Clock, Users, CheckCircle } from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description?: string;
  options: any; // Will be Json from database, need to parse
  expires_at?: string;
  is_active: boolean;
}

interface PollVote {
  poll_id: string;
  option_index: number;
  user_id?: string;
}

interface PollWithStats extends Poll {
  votes: PollVote[];
  userVote?: number;
  totalVotes: number;
  optionStats: { votes: number; percentage: number }[];
}

interface OptimizedRadioPollsProps {
  programId?: string;
}

const OptimizedRadioPolls: React.FC<OptimizedRadioPollsProps> = ({ programId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<PollWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  // Memoize expensive calculations
  const activePollsWithStats = useMemo(() => {
    return polls.filter(poll => poll.is_active && !isExpired(poll));
  }, [polls]);

  useEffect(() => {
    fetchPolls();
    
    // Optimized real-time subscription
    const channel = supabase
      .channel('radio-polls-votes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'radio_poll_votes'
        },
        () => {
          // Debounced refetch to avoid too many calls
          setTimeout(fetchPolls, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      // Fetch active polls only
      const { data: pollsData, error: pollsError } = await supabase
        .from('radio_polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      if (!pollsData || pollsData.length === 0) {
        setPolls([]);
        return;
      }

      // Batch fetch all votes for all polls
      const pollIds = pollsData.map(poll => poll.id);
      const { data: votesData, error: votesError } = await supabase
        .from('radio_poll_votes')
        .select('poll_id, option_index, user_id')
        .in('poll_id', pollIds);

      if (votesError) throw votesError;

      // Process polls with stats efficiently
      const pollsWithStats: PollWithStats[] = pollsData.map(poll => {
        const pollVotes = votesData?.filter(vote => vote.poll_id === poll.id) || [];
        const userVote = user ? pollVotes.find(vote => vote.user_id === user.id) : undefined;
        const totalVotes = pollVotes.length;
        
        // Parse options from JSON and calculate statistics
        const parsedOptions = Array.isArray(poll.options) ? poll.options : [];
        const optionStats = parsedOptions.map((_, index) => {
          const votes = pollVotes.filter(vote => vote.option_index === index).length;
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          return { votes, percentage };
        });

        return {
          ...poll,
          options: parsedOptions,
          votes: pollVotes,
          userVote: userVote?.option_index,
          totalVotes,
          optionStats
        };
      });

      setPolls(pollsWithStats);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar enquetes",
        variant: "destructive",
      });
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

    setVoting(pollId);
    try {
      const poll = polls.find(p => p.id === pollId);
      if (!poll) return;

      if (poll.userVote !== undefined) {
        // Update existing vote
        const { error } = await supabase
          .from('radio_poll_votes')
          .update({ option_index: optionIndex })
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new vote
        const { error } = await supabase
          .from('radio_poll_votes')
          .insert({
            poll_id: pollId,
            option_index: optionIndex,
            user_id: user.id
          });

        if (error) throw error;
      }

      toast({
        title: "Voto registado",
        description: "Seu voto foi registado com sucesso!",
      });

      // Optimistically update local state
      setPolls(prev => prev.map(p => {
        if (p.id === pollId) {
          const newVotes = p.userVote !== undefined 
            ? p.votes.map(v => v.user_id === user.id ? { ...v, option_index: optionIndex } : v)
            : [...p.votes, { poll_id: pollId, option_index: optionIndex, user_id: user.id }];
          
          const totalVotes = newVotes.length;
          const parsedOptions = Array.isArray(p.options) ? p.options : [];
          const optionStats = parsedOptions.map((_, index) => {
            const votes = newVotes.filter(vote => vote.option_index === index).length;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            return { votes, percentage };
          });

          return {
            ...p,
            votes: newVotes,
            userVote: optionIndex,
            totalVotes,
            optionStats
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Erro",
        description: "Erro ao registar voto",
        variant: "destructive",
      });
    } finally {
      setVoting(null);
    }
  };

  const isExpired = (poll: Poll) => {
    if (!poll.expires_at) return false;
    return new Date(poll.expires_at) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (activePollsWithStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Enquetes da Rádio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Não há enquetes ativas no momento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Enquetes da Rádio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activePollsWithStats.map((poll) => (
          <div key={poll.id} className="border rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-1">{poll.title}</h3>
              {poll.description && (
                <p className="text-sm text-muted-foreground mb-2">{poll.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{poll.totalVotes} votos</span>
                </div>
                {poll.expires_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Expira: {new Date(poll.expires_at).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {poll.options.map((option, index) => {
                const hasVoted = poll.userVote !== undefined;
                const isSelected = poll.userVote === index;
                const stats = poll.optionStats[index];
                const isVoting = voting === poll.id;

                if (hasVoted || isExpired(poll)) {
                  // Show results
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                          {option.text}
                          {isSelected && <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" />}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stats.votes} ({Math.round(stats.percentage)}%)
                        </span>
                      </div>
                      <Progress 
                        value={stats.percentage} 
                        className={`h-2 ${isSelected ? 'bg-green-100' : ''}`}
                      />
                    </div>
                  );
                } else {
                  // Show voting buttons
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(poll.id, index)}
                      disabled={isVoting}
                      className="w-full justify-start h-auto p-3 text-left whitespace-normal"
                    >
                      {option.text}
                    </Button>
                  );
                }
              })}
            </div>

            {!user && (
              <p className="text-xs text-muted-foreground text-center">
                Faça login para votar
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OptimizedRadioPolls;