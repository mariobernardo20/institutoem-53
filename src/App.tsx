import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { QueryProvider } from "@/providers/QueryProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./providers/AuthProvider";

// Lazy load pages for better performance
import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Critical pages - load immediately
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Non-critical pages - lazy load
const Search = lazy(() => import("./pages/Search"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Scholarships = lazy(() => import("./pages/Scholarships"));
const Candidates = lazy(() => import("./pages/Candidates"));
const Contact = lazy(() => import("./pages/Contact"));
const Immigration = lazy(() => import("./pages/Immigration"));
const Radio = lazy(() => import("./pages/Radio"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminAcceptInvite = lazy(() => import("./pages/AdminAcceptInvite"));
const CandidateProfile = lazy(() => import("./pages/CandidateProfile"));
const CandidateDashboard = lazy(() => import("./pages/CandidateDashboard").then(module => ({ default: module.CandidateDashboard })));
const Pricing = lazy(() => import("./pages/Pricing"));
const PackageComparison = lazy(() => import("./pages/PackageComparison"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(t);
  }, []);
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        {slow && (
          <div className="flex items-center justify-between rounded-md border p-4">
            <p className="text-sm text-muted-foreground">Está demorando mais que o normal. Deseja recarregar?</p>
            <Button onClick={() => window.location.reload()} size="sm" variant="outline">
              Recarregar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Critical routes - no lazy loading */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registro" element={<Register />} />
              
              {/* Lazy loaded routes */}
              <Route path="/search" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Search />
                </Suspense>
              } />
              <Route path="/jobs" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Jobs />
                </Suspense>
              } />
              <Route path="/scholarships" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Scholarships />
                </Suspense>
              } />
              <Route path="/candidates" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Candidates />
                </Suspense>
              } />
              <Route path="/candidatos" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Candidates />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Contact />
                </Suspense>
              } />
              <Route path="/immigration" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Immigration />
                </Suspense>
              } />
              <Route path="/imigracao" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Immigration />
                </Suspense>
              } />
              <Route path="/radio" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Radio />
                </Suspense>
              } />
              <Route path="/auth" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Auth />
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Admin />
                </Suspense>
              } />
              <Route path="/admin-login" element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminLogin />
                </Suspense>
              } />
              <Route path="/admin-accept-invite" element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminAcceptInvite />
                </Suspense>
              } />
              <Route path="/candidate/:id" element={
                <Suspense fallback={<LoadingFallback />}>
                  <CandidateProfile />
                </Suspense>
              } />
              <Route path="/candidato/:id" element={
                <Suspense fallback={<LoadingFallback />}>
                  <CandidateProfile />
                </Suspense>
              } />
              <Route path="/candidate-profile" element={
                <Suspense fallback={<LoadingFallback />}>
                  <CandidateProfile />
                </Suspense>
              } />
              <Route path="/candidate-dashboard" element={
                <Suspense fallback={<LoadingFallback />}>
                  <CandidateDashboard />
                </Suspense>
              } />
              <Route path="/pricing" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Pricing />
                </Suspense>
              } />
              <Route path="/precos" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Pricing />
                </Suspense>
              } />
              <Route path="/package-comparison" element={
                <Suspense fallback={<LoadingFallback />}>
                  <PackageComparison />
                </Suspense>
              } />
              <Route path="/comparacao-pacotes" element={
                <Suspense fallback={<LoadingFallback />}>
                  <PackageComparison />
                </Suspense>
              } />
              <Route path="/privacy-policy" element={
                <Suspense fallback={<LoadingFallback />}>
                  <PrivacyPolicy />
                </Suspense>
              } />
              <Route path="/politica-privacidade" element={
                <Suspense fallback={<LoadingFallback />}>
                  <PrivacyPolicy />
                </Suspense>
              } />
              <Route path="/terms-conditions" element={
                <Suspense fallback={<LoadingFallback />}>
                  <TermsConditions />
                </Suspense>
              } />
              <Route path="/termos-condicoes" element={
                <Suspense fallback={<LoadingFallback />}>
                  <TermsConditions />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<LoadingFallback />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryProvider>
  );
}

export default App;