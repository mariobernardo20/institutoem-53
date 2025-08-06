import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PackageComparison = () => {
  const features = [
    { name: "Criação de currículo", free: true, premium: true },
    { name: "Visualizar vagas", free: "Limitado", premium: "Ilimitado" },
    { name: "Candidatura direta", free: false, premium: true },
    { name: "Perfil destacado", free: false, premium: true },
    { name: "Análise de compatibilidade", free: false, premium: true },
    { name: "Suporte por email", free: true, premium: true },
    { name: "Suporte prioritário", free: false, premium: true },
    { name: "Mentoria especializada", free: false, premium: true },
    { name: "Ferramentas de networking", free: false, premium: true },
    { name: "Acesso a eventos exclusivos", free: false, premium: true },
    { name: "Análise detalhada do perfil", free: false, premium: true },
    { name: "Recomendações personalizadas", free: false, premium: true },
    { name: "Backup e sincronização", free: false, premium: true },
    { name: "Relatórios de desempenho", free: false, premium: true },
    { name: "API de integração", free: false, premium: true }
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-sm text-center">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comparação Detalhada de Pacotes
          </h1>
          <p className="text-xl text-muted-foreground">
            Veja todas as funcionalidades incluídas em cada plano
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Funcionalidades por Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-medium">Funcionalidade</th>
                      <th className="text-center py-4 px-4 font-medium">Plano Grátis</th>
                      <th className="text-center py-4 px-4 font-medium">Plano Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4 font-medium">{feature.name}</td>
                        <td className="py-4 px-4 text-center">
                          {renderFeatureValue(feature.free)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {renderFeatureValue(feature.premium)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Plano Grátis</h3>
                  <p className="text-3xl font-bold mb-4">Grátis</p>
                  <Button variant="outline" className="w-full">
                    Começar Grátis
                  </Button>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Plano Premium</h3>
                  <p className="text-3xl font-bold mb-4">9.32 EUR<span className="text-sm font-normal">/mês</span></p>
                  <Button className="w-full">
                    Subscrever Agora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageComparison;