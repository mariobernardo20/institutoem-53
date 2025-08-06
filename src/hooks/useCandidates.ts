import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Candidate {
  id: string;
  name: string;
  area: string;
  experience_years: number;
  email: string;
  phone: string;
  description: string;
  skills: string[];
  image_url?: string;
  created_at: string;
  location?: string;
  education?: string;
  certifications?: string[];
  languages?: string[];
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const candidatesData = data || [];
      setCandidates(candidatesData);
      
      // Atualizar cache local para sincronização entre páginas
      localStorage.setItem('candidates_cache', JSON.stringify(candidatesData));
      
      return candidatesData;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError("Erro ao carregar candidatos");
      
      // Fallback para cache local
      const storedCandidates = localStorage.getItem('candidates_cache');
      if (storedCandidates) {
        const cachedData = JSON.parse(storedCandidates);
        setCandidates(cachedData);
        return cachedData;
      } else {
        // Dados simulados como fallback final
        const mockCandidates: Candidate[] = [
          {
            id: "1",
            name: "Ana Silva",
            area: "Tecnologia da Informação",
            experience_years: 5,
            email: "ana.silva@email.com",
            phone: "+351 912 345 678",
            description: "Desenvolvedora Full Stack com experiência em React, Node.js e bases de dados. Paixão por criar soluções inovadoras.",
            skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            name: "João Santos",
            area: "Design Gráfico",
            experience_years: 3,
            email: "joao.santos@email.com",
            phone: "+351 913 456 789",
            description: "Designer gráfico criativo com especialização em branding e design digital. Experiência em agências de publicidade.",
            skills: ["Photoshop", "Illustrator", "Figma", "Branding", "UI/UX"],
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "3",
            name: "Maria Costa",
            area: "Marketing Digital",
            experience_years: 7,
            email: "maria.costa@email.com",
            phone: "+351 914 567 890",
            description: "Especialista em marketing digital com foco em SEO, SEM e estratégias de content marketing.",
            skills: ["SEO", "Google Ads", "Analytics", "Social Media", "Content Marketing"],
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setCandidates(mockCandidates);
        localStorage.setItem('candidates_cache', JSON.stringify(mockCandidates));
        return mockCandidates;
      }
    } finally {
      setLoading(false);
    }
  };

  const getCandidateById = async (id: string): Promise<Candidate | null> => {
    try {
      // Primeiro tentar buscar do estado atual
      const candidate = candidates.find(c => c.id === id);
      if (candidate) return candidate;

      // Se não encontrou, buscar do cache
      const storedCandidates = localStorage.getItem('candidates_cache');
      if (storedCandidates) {
        const cachedCandidates = JSON.parse(storedCandidates);
        const cachedCandidate = cachedCandidates.find((c: Candidate) => c.id === id);
        if (cachedCandidate) return cachedCandidate;
      }

      // Se ainda não encontrou, buscar do banco
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching candidate by ID:', error);
      return null;
    }
  };

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      setCandidates(prev => prev.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ));

      // Atualizar cache local
      const storedCandidates = localStorage.getItem('candidates_cache');
      if (storedCandidates) {
        const cachedCandidates = JSON.parse(storedCandidates);
        const updatedCache = cachedCandidates.map((c: Candidate) => 
          c.id === id ? { ...c, ...updates } : c
        );
        localStorage.setItem('candidates_cache', JSON.stringify(updatedCache));
      }

      toast({
        title: "Sucesso",
        description: "Candidato atualizado com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar candidato",
        variant: "destructive"
      });
      return false;
    }
  };

  // Observar mudanças no localStorage para sincronização entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'candidates_cache' && e.newValue) {
        const updatedCandidates = JSON.parse(e.newValue);
        setCandidates(updatedCandidates);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading,
    error,
    fetchCandidates,
    getCandidateById,
    updateCandidate,
    reload: fetchCandidates
  };
};