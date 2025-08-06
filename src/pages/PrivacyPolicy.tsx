import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-primary-foreground hover:text-primary-foreground/80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none text-foreground">
          <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
          <p className="mb-4 text-muted-foreground">
            Coletamos as seguintes informações quando você utiliza nossos serviços:
          </p>
          <ul className="mb-6 ml-6 text-muted-foreground">
            <li className="mb-2">Informações pessoais (nome, email, telefone)</li>
            <li className="mb-2">Informações profissionais (experiência, habilidades)</li>
            <li className="mb-2">Dados de uso da plataforma</li>
            <li className="mb-2">Informações do dispositivo e navegador</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">2. Como Utilizamos suas Informações</h2>
          <p className="mb-4 text-muted-foreground">
            Utilizamos suas informações para:
          </p>
          <ul className="mb-6 ml-6 text-muted-foreground">
            <li className="mb-2">Fornecer e melhorar nossos serviços</li>
            <li className="mb-2">Conectar candidatos com oportunidades de emprego</li>
            <li className="mb-2">Comunicar sobre atualizações e oportunidades</li>
            <li className="mb-2">Personalizar sua experiência na plataforma</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
          <p className="mb-4 text-muted-foreground">
            Podemos compartilhar suas informações com:
          </p>
          <ul className="mb-6 ml-6 text-muted-foreground">
            <li className="mb-2">Empregadores interessados (com seu consentimento)</li>
            <li className="mb-2">Prestadores de serviços terceirizados</li>
            <li className="mb-2">Autoridades legais quando exigido por lei</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Segurança dos Dados</h2>
          <p className="mb-6 text-muted-foreground">
            Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos</h2>
          <p className="mb-4 text-muted-foreground">
            Você tem o direito de:
          </p>
          <ul className="mb-6 ml-6 text-muted-foreground">
            <li className="mb-2">Acessar suas informações pessoais</li>
            <li className="mb-2">Corrigir informações incorretas</li>
            <li className="mb-2">Solicitar a exclusão de seus dados</li>
            <li className="mb-2">Retirar seu consentimento a qualquer momento</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
          <p className="mb-6 text-muted-foreground">
            Utilizamos cookies para melhorar sua experiência de navegação, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
          </p>

          <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
          <p className="mb-6 text-muted-foreground">
            Mantemos suas informações pelo tempo necessário para cumprir os propósitos descritos nesta política ou conforme exigido por lei.
          </p>

          <h2 className="text-2xl font-semibold mb-4">8. Alterações nesta Política</h2>
          <p className="mb-6 text-muted-foreground">
            Podemos atualizar esta política de privacidade periodicamente. Notificaremos sobre mudanças significativas através da plataforma ou por email.
          </p>

          <h2 className="text-2xl font-semibold mb-4">9. Contato</h2>
          <p className="mb-6 text-muted-foreground">
            Para questões sobre esta política de privacidade ou sobre o tratamento de seus dados, entre em contato conosco: contacto@InstitutoEmpreendedor.pt
          </p>

          <p className="text-sm text-muted-foreground">
            Última atualização: Janeiro de 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;