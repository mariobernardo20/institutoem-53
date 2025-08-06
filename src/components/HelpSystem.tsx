import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Bot, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface HelpSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const HelpSystem = ({ isOpen, onClose }: HelpSystemProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Como posso ajudá-lo hoje? Pode perguntar sobre candidaturas, vagas, bolsas de estudo, registro ou sobre o Instituto Empreendedor.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const getResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Respostas específicas sobre candidaturas
    if (lowerMessage.includes('candidatura') || lowerMessage.includes('candidatar') || lowerMessage.includes('aplicar')) {
      return "Para se candidatar a vagas, acesse a seção 'Candidatos' no menu principal. Lá você pode criar seu perfil, adicionar seu CV e foto, e se candidatar às vagas disponíveis. Certifique-se de preencher todas as informações do seu perfil para aumentar suas chances.";
    }
    
    // Respostas sobre vagas
    if (lowerMessage.includes('vaga') || lowerMessage.includes('emprego') || lowerMessage.includes('trabalho')) {
      return "Você pode encontrar vagas na seção 'Vagas' do site. Use os filtros para buscar por categoria, localização e tipo de contrato. Mantemos nossa base de dados atualizada com oportunidades em Portugal e outros países. Cadastre-se para receber notificações de novas vagas.";
    }
    
    // Respostas sobre bolsas de estudo
    if (lowerMessage.includes('bolsa') || lowerMessage.includes('estudo') || lowerMessage.includes('universitário') || lowerMessage.includes('curso')) {
      return "Acesse a seção 'Bolsas de Estudo' para ver oportunidades disponíveis. Oferecemos bolsas para diversos níveis: graduação, mestrado, doutorado e cursos técnicos. Filtre por área de estudo, país de destino e valor da bolsa. Mantenha seu perfil atualizado para receber notificações.";
    }
    
    // Respostas sobre registro/cadastro
    if (lowerMessage.includes('registrar') || lowerMessage.includes('cadastrar') || lowerMessage.includes('conta') || lowerMessage.includes('login')) {
      return "Para se registrar, clique em 'Registrar' no menu superior. Você precisará fornecer nome, email e criar uma senha. Após o registro, complete seu perfil com informações profissionais e acadêmicas. Isso ajudará a receber oportunidades personalizadas.";
    }
    
    // Respostas sobre o instituto
    if (lowerMessage.includes('instituto') || lowerMessage.includes('empresa') || lowerMessage.includes('organização') || lowerMessage.includes('sobre')) {
      return "O Instituto Empreendedor é uma plataforma inovadora que conecta profissionais a oportunidades de trabalho e estudo em todo o mundo. Nossa missão é ajudar empreendedores e profissionais a encontrar o emprego dos seus sonhos, oferecendo vagas, bolsas de estudo, conteúdo educativo e nossa rádio dedicada ao empreendedorismo.";
    }
    
    // Respostas sobre rádio
    if (lowerMessage.includes('rádio') || lowerMessage.includes('programa') || lowerMessage.includes('música')) {
      return "Nossa Rádio Instituto Empreendedor está disponível 24h com conteúdo motivacional e educativo sobre empreendedorismo. Acesse através do menu 'Rádio' para ouvir ao vivo, ver a programação e conhecer nossa equipe de apresentadores.";
    }
    
    // Respostas sobre imigração
    if (lowerMessage.includes('imigração') || lowerMessage.includes('visto') || lowerMessage.includes('portugal') || lowerMessage.includes('residência')) {
      return "Temos uma seção dedicada com notícias atualizadas sobre imigração para Portugal. Cobrimos temas como vistos CPLP, autorizações de residência, nacionalidade portuguesa e processos da AIMA. Consulte nossas notícias para informações atualizadas.";
    }
    
    // Resposta padrão
    return "Posso ajudá-lo com: 📋 Candidaturas e perfis, 💼 Vagas de emprego, 🎓 Bolsas de estudo, 👤 Registro e login, 🏢 Informações sobre o Instituto. Seja mais específico sobre o que precisa saber!";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-lg font-medium">
            Ajuda
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  message.isUser 
                    ? 'bg-green-500 text-white rounded-br-sm' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}>
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-green-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-6 pt-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-white"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim()}
              className="bg-green-500 hover:bg-green-600 text-white px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpSystem;