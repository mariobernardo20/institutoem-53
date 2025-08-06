import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const freeFeatures = [
    "Criação de currículo básico",
    "Visualizar vagas limitadas",
    "Perfil básico",
    "Suporte por email"
  ];

  const premiumFeatures = [
    "Criação de currículo avançado",
    "Visualização ilimitada de vagas",
    "Candidatura direta",
    "Perfil destacado",
    "Análise de compatibilidade",
    "Suporte prioritário",
    "Mentoria especializada",
    "Ferramentas de networking"
  ];

  const premiumPrice = isAnnual ? "7.46" : "9.32";
  const savings = isAnnual ? "20%" : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Se você está apenas começando ou procurando avançar em sua carreira, nós temos o que você precisa
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Escolha o plano que melhor se adapta às suas necessidades profissionais
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Cobrança Mensal
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Cobrança Anual {savings && `(poupe ${savings})`}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Grátis */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Plano Grátis</CardTitle>
              <CardDescription>Ideal para começar</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Grátis</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Começar Grátis
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Plano Premium</CardTitle>
              <CardDescription>Para profissionais ambiciosos</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{premiumPrice} EUR</span>
                <span className="text-muted-foreground">/mês</span>
                {isAnnual && (
                  <div className="text-sm text-primary mt-1">
                    Economize 20% com pagamento anual
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mb-4">
                Subscrever Agora
              </Button>
              <div className="text-center">
                <Link 
                  to="/comparacao-pacotes" 
                  className="text-primary hover:underline text-sm"
                >
                  Ver mais detalhes
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;