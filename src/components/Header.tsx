import { Button } from "@/components/ui/button";
import { Search, Radio, Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Header = () => {
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const mainMenuItems = [{
    label: t('nav.news'),
    href: "/",
    active: true
  }, {
    label: t('nav.candidates'),
    href: "/candidatos"
  }, {
    label: t('nav.jobs'),
    href: "/jobs"
  }, {
    label: t('nav.scholarships'),
    href: "/scholarships"
  }, {
    label: t('nav.radio'),
    href: "/radio",
    icon: Radio
  }, {
    label: t('nav.contact'),
    href: "/contact"
  }];
  return <header className="bg-background border-b">
      {/* Top bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 flex items-center justify-center">
              <img src="/lovable-uploads/304d008b-b833-4324-ac1c-b16506f1f78e.png" alt="Instituto Empreendedor" className="h-8 object-contain" />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {mainMenuItems.map(item => <Link key={item.label} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${item.active ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"}`}>
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>)}
          </nav>

          {/* Right side - Language switcher and auth buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => setLanguage('pt')} className={`font-medium transition-colors ${language === 'pt' ? 'text-foreground' : 'hover:text-foreground'}`}>
                PT
              </button>
              <span>/</span>
              <button onClick={() => setLanguage('en')} className={`font-medium transition-colors ${language === 'en' ? 'text-foreground' : 'hover:text-foreground'}`}>
                EN
              </button>
            </div>
            
            {/* Auth section */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {profile?.full_name || user.email?.split('@')[0] || 'Usuário'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          Administração
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm">
                      Registrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden border-t bg-background">
            <nav className="px-4 py-2 space-y-2">
              {mainMenuItems.map(item => <Link key={item.label} to={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 py-2 px-2 rounded text-sm font-medium transition-colors hover:bg-muted ${item.active ? "text-primary bg-muted" : "text-muted-foreground"}`}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>)}
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;