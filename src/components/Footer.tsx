import { Facebook, Instagram, Twitter, Youtube, Dribbble, Mail } from "lucide-react";
import HelpSystem from "./HelpSystem";
import { useState } from "react";
const Footer = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  return <footer className="bg-background border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 mx-0 rounded-full">
              <img src="/lovable-uploads/65a3eae4-e03e-48d0-b96b-2222f0ad001b.png" alt="Instituto Empreendedor" className="h-12 w-auto" />
            </div>
            <p className="leading-relaxed text-zinc-950 text-left font-medium text-sm">
              Instituto Empreendedor é uma plataforma inovadora que conecta candidatos a 
              emprego com oportunidades de trabalho em todo o mundo. Nossa missão é 
              ajudar profissionais a encontrar o emprego dos seus sonhos, oferecendo uma 
              ampla gama de serviços e recursos para facilitar o processo de candidatura e 
              recrutamento.
            </p>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">LINKS</h4>
            <ul className="space-y-3">
              <li><a href="/termos-condicoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Termos e Condições</a></li>
              <li><a href="/politica-privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</a></li>
              <li><a href="/precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</a></li>
              <li><a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fale Conosco</a></li>
              <li><a href="/registro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Registrar</a></li>
              <li><a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">RESOURCES</h4>
            <ul className="space-y-3">
              <li><a href="/candidatos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Candidatos</a></li>
              <li><a href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Vagas</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">FALE CONOSCO</h4>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Dribbble size={16} />
              </a>
            </div>
            <div className="flex items-center text-sm text-primary">
              <Mail size={16} className="mr-2" />
              <span>contacto@Instituto Empreendedor.pt</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="relative flex justify-center items-center">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Instituto Empreendedor. Todos os Direitos Reservados.
            </p>
            <button onClick={() => setIsHelpOpen(true)} className="absolute right-0 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm font-medium">
              <span className="text-white text-lg">ℹ️</span>
              <span>Ajuda?</span>
            </button>
          </div>
        </div>
        
        <HelpSystem isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </footer>;
};
export default Footer;