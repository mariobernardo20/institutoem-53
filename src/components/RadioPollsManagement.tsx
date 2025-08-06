import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, BarChart3, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Poll {
  id: string;
  title: string;
  description?: string;
  options: string[];
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  program_id?: string;
}

interface PollWithStats extends Poll {
  totalVotes: number;
  optionStats: Array<{
    option: string;
    votes: number;
    percentage: number;
  }>;
}

const RadioPollsManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [polls, setPolls] = useState<PollWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchPolls();
    }
  }, [isAdmin]);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('radio_polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (pollsError) {
        console.error('Error fetching polls:', pollsError);
        return;
      }

      if (!pollsData) {
        setPolls([]);
        return;
      }

      // Fetch votes for statistics
      const pollIds = pollsData.map(poll => poll.id);
      const { data: votesData } = await supabase
        .from('radio_poll_votes')
        .select('*')
        .in('poll_id', pollIds);

      // Calculate statistics
      const pollsWithStats: PollWithStats[] = pollsData.map(poll => {
        const pollVotes = votesData?.filter(vote => vote.poll_id === poll.id) || [];
        const totalVotes = pollVotes.length;
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

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setOptions(['', '']);
    setExpiresAt('');
    setIsActive(true);
    setEditingPoll(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Erro",
        description: "Pelo menos 2 opções são necessárias",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const pollData = {
        title: title.trim(),
        description: description.trim() || null,
        options: validOptions,
        is_active: isActive,
        expires_at: expiresAt || null,
        created_by: user!.id,
      };

      if (editingPoll) {
        // Update existing poll
        const { error } = await supabase
          .from('radio_polls')
          .update(pollData)
          .eq('id', editingPoll.id);

        if (error) {
          console.error('Error updating poll:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar enquete",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Sucesso",
          description: "Enquete atualizada com sucesso!",
        });
      } else {
        // Create new poll
        const { error } = await supabase
          .from('radio_polls')
          .insert(pollData);

        if (error) {
          console.error('Error creating poll:', error);
          toast({
            title: "Erro",
            description: "Erro ao criar enquete",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Sucesso",
          description: "Enquete criada com sucesso!",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchPolls();
    } catch (error) {
      console.error('Error saving poll:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar enquete",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (poll: Poll) => {
    setEditingPoll(poll);
    setTitle(poll.title);
    setDescription(poll.description || '');
    setOptions(poll.options.length >= 2 ? poll.options : [...poll.options, '', '']);
    setExpiresAt(poll.expires_at ? poll.expires_at.split('.')[0] : '');
    setIsActive(poll.is_active);
    setIsDialogOpen(true);
  };

  const handleDelete = async (pollId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta enquete?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('radio_polls')
        .delete()
        .eq('id', pollId);

      if (error) {
        console.error('Error deleting poll:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir enquete",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Enquete excluída com sucesso!",
      });

      fetchPolls();
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir enquete",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Gestão de Enquetes
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Enquete
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPoll ? 'Editar Enquete' : 'Nova Enquete'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título da enquete"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição opcional"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Opções *</Label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Opção
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="expires_at">Data de Expiração</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is_active">Enquete ativa</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Salvando...' : editingPoll ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {loading && polls.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : polls.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma enquete encontrada.
          </p>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => (
              <Card key={poll.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{poll.title}</h3>
                      <Badge variant={poll.is_active ? "default" : "secondary"}>
                        {poll.is_active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    {poll.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {poll.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {poll.totalVotes} votos
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(poll)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(poll.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {poll.optionStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{stat.option}</span>
                      <span className="text-muted-foreground">
                        {stat.votes} ({stat.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>

                {poll.expires_at && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Expira em: {new Date(poll.expires_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RadioPollsManagement;