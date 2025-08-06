import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Header
    'nav.news': 'Notícias',
    'nav.candidates': 'Candidatos',
    'nav.jobs': 'Vagas',
    'nav.scholarships': 'Bolsas de Estudo',
    'nav.radio': 'Rádio',
    'nav.contact': 'Contacto',
    'nav.login': 'Entrar',
    'nav.register': 'Registrar',
    
    // Radio
    'radio.live': 'AO VIVO',
    'radio.listeners': 'ouvintes',
    'radio.currentProgram': 'AO VIVO AGORA:',
    'radio.schedule': 'Programação de Hoje',
    'radio.connecting': 'A conectar...',
    'radio.paused': 'Rádio pausada',
    'radio.nowPlaying': '🎵 A ouvir ao vivo!',
    
    // Jobs
    'jobs.title': 'Oportunidades de Emprego',
    'jobs.subtitle': 'Encontre a sua próxima oportunidade profissional',
    'jobs.location': 'Localização',
    'jobs.salary': 'Salário',
    'jobs.type': 'Tipo',
    'jobs.apply': 'Candidatar-se',
    'jobs.remote': 'Remoto',
    'jobs.fullTime': 'Tempo Integral',
    'jobs.partTime': 'Meio Período',
    'jobs.contract': 'Contrato',
    
    // Scholarships
    'scholarships.title': 'Bolsas de Estudo',
    'scholarships.subtitle': 'Oportunidades de financiamento para a sua educação',
    'scholarships.deadline': 'Prazo',
    'scholarships.amount': 'Valor',
    'scholarships.eligibility': 'Elegibilidade',
    'scholarships.learnMore': 'Saber Mais',
    
    // Contact
    'contact.title': 'Entre em Contacto',
    'contact.subtitle': 'Estamos aqui para ajudar. Entre em contacto connosco.',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.subject': 'Assunto',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar Mensagem',
    'contact.phone': 'Telefone',
    'contact.address': 'Morada',
    'contact.hours': 'Horário de Funcionamento'
  },
  en: {
    // Header
    'nav.news': 'News',
    'nav.candidates': 'Candidates',
    'nav.jobs': 'Jobs',
    'nav.scholarships': 'Scholarships',
    'nav.radio': 'Radio',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Radio
    'radio.live': 'LIVE',
    'radio.listeners': 'listeners',
    'radio.currentProgram': 'LIVE NOW:',
    'radio.schedule': "Today's Schedule",
    'radio.connecting': 'Connecting...',
    'radio.paused': 'Radio paused',
    'radio.nowPlaying': '🎵 Listening live!',
    
    // Jobs
    'jobs.title': 'Job Opportunities',
    'jobs.subtitle': 'Find your next professional opportunity',
    'jobs.location': 'Location',
    'jobs.salary': 'Salary',
    'jobs.type': 'Type',
    'jobs.apply': 'Apply',
    'jobs.remote': 'Remote',
    'jobs.fullTime': 'Full Time',
    'jobs.partTime': 'Part Time',
    'jobs.contract': 'Contract',
    
    // Scholarships
    'scholarships.title': 'Scholarships',
    'scholarships.subtitle': 'Funding opportunities for your education',
    'scholarships.deadline': 'Deadline',
    'scholarships.amount': 'Amount',
    'scholarships.eligibility': 'Eligibility',
    'scholarships.learnMore': 'Learn More',
    
    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'We are here to help. Get in touch with us.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.hours': 'Opening Hours'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};