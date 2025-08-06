import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Radio from "./pages/Radio";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import Admin from "./pages/Admin";
import Immigration from "./pages/Immigration";
import Jobs from "./pages/Jobs";
import Scholarships from "./pages/Scholarships";
import Contact from "./pages/Contact";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Pricing from "./pages/Pricing";
import PackageComparison from "./pages/PackageComparison";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/candidatos" element={<Candidates />} />
              <Route path="/candidato/:id" element={<CandidateProfile />} />
              <Route path="/imigracao" element={<Immigration />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/termos-condicoes" element={<TermsConditions />} />
              <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
              <Route path="/precos" element={<Pricing />} />
              <Route path="/comparacao-pacotes" element={<PackageComparison />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/login" element={<Login />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
