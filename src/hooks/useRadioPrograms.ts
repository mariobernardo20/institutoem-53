import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RadioProgram } from "@/types/database";

export type { RadioProgram };
import { Tables } from "@/integrations/supabase/types";

type DbRadioProgram = Tables<"radio_programs">;

export const useRadioPrograms = () => {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('radio_programs')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      const programsData = (data || []).map((program: DbRadioProgram): RadioProgram => ({
        ...program,
        name: program.title,
        host: program.host_name || 'Host não especificado',
        day_of_week: 0, // Default value
        start_time: program.schedule_time || '00:00',
        end_time: '23:59' // Default end time
      }));
      setPrograms(programsData);
    } catch (error) {
      console.error('Error fetching radio programs:', error);
      toast({
        title: "Erro ao carregar programas",
        description: "Não foi possível carregar a programação da rádio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProgram = async (program: Omit<RadioProgram, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const dbProgram = {
        title: program.name,
        host_name: program.host,
        description: program.description,
        schedule_time: program.start_time,
        duration_minutes: 60,
        is_active: true
      };
      
      const { data, error } = await supabase
        .from('radio_programs')
        .insert([dbProgram])
        .select()
        .single();

      if (error) throw error;

      const newProgram: RadioProgram = {
        ...data,
        name: data.title,
        host: data.host_name || 'Host não especificado',
        day_of_week: 0,
        start_time: data.schedule_time || '00:00',
        end_time: '23:59'
      };
      setPrograms(prev => [...prev, newProgram]);
      toast({
        title: "Programa criado",
        description: "Programa adicionado à programação com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Error creating radio program:', error);
      toast({
        title: "Erro ao criar programa",
        description: "Não foi possível adicionar o programa",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProgram = async (id: string, updates: Partial<RadioProgram>) => {
    try {
      const { data, error } = await supabase
        .from('radio_programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProgram: RadioProgram = {
        ...data,
        name: data.title,
        host: data.host_name || 'Host não especificado',
        day_of_week: 0,
        start_time: data.schedule_time || '00:00',
        end_time: '23:59'
      };
      setPrograms(prev => prev.map(p => p.id === id ? updatedProgram : p));
      toast({
        title: "Programa atualizado",
        description: "Alterações salvas com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Error updating radio program:', error);
      toast({
        title: "Erro ao atualizar programa",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      const { error } = await supabase
        .from('radio_programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrograms(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Programa excluído",
        description: "Programa removido da programação",
      });
    } catch (error) {
      console.error('Error deleting radio program:', error);
      toast({
        title: "Erro ao excluir programa",
        description: "Não foi possível remover o programa",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getTodayPrograms = () => {
    const today = new Date().getDay();
    return programs.filter(p => p.day_of_week === today);
  };

  const getCurrentProgram = () => {
    const now = new Date();
    const todayPrograms = getTodayPrograms();
    
    return todayPrograms.find(program => {
      const [startHour, startMinute] = program.start_time.split(':').map(Number);
      const [endHour, endMinute] = program.end_time.split(':').map(Number);
      
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      
      return currentTime >= startTime && currentTime < endTime;
    });
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    isLoading,
    fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getTodayPrograms,
    getCurrentProgram,
  };
};