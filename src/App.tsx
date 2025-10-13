import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DiceLogProvider } from "@/contexts/DiceLogContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CharacterNew from "./pages/CharacterNew";
import CharacterEdit from "./pages/CharacterEdit";
import RulesCodex from "./pages/RulesCodex";
import AdminSeed from "./pages/AdminSeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DiceLogProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/character/new" element={<CharacterNew />} />
            <Route path="/character/:id" element={<CharacterEdit />} />
            <Route path="/codex" element={<RulesCodex />} />
            <Route path="/admin/seed" element={<AdminSeed />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </DiceLogProvider>
    </QueryClientProvider>
  );
};

export default App;
