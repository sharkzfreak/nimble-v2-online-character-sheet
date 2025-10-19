import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DiceLogProvider } from "@/contexts/DiceLogContext";
import { CodexProvider } from "@/contexts/CodexContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CharacterNew from "./pages/CharacterNew";
import CharacterEdit from "./pages/CharacterEdit";
import CharacterBuilder from "./pages/CharacterBuilder";
import RulesCodex from "./pages/RulesCodex";
import AdminSeed from "./pages/AdminSeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CodexProvider>
        <DiceLogProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/character/:id" element={<CharacterEdit />} />
                <Route path="/character/new" element={<CharacterNew />} />
                <Route path="/builder" element={<CharacterBuilder />} />
                <Route path="/admin/seed" element={<AdminSeed />} />
                <Route path="/codex" element={<RulesCodex />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DiceLogProvider>
      </CodexProvider>
    </QueryClientProvider>
  );
};

export default App;
