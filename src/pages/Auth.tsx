import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scroll, Sparkles } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scroll className="w-12 h-12 text-primary animate-pulse" />
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Nimble Adventurer
          </h1>
          <p className="text-muted-foreground">Your gateway to epic character management</p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border shadow-[var(--shadow-card)]">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(262 83% 58%)",
                    brandAccent: "hsl(282 80% 65%)",
                    brandButtonText: "hsl(43 96% 89%)",
                    defaultButtonBackground: "hsl(217 33% 17%)",
                    defaultButtonBackgroundHover: "hsl(217 33% 20%)",
                    defaultButtonBorder: "hsl(217 33% 25%)",
                    defaultButtonText: "hsl(43 96% 89%)",
                    dividerBackground: "hsl(217 33% 25%)",
                    inputBackground: "hsl(222 40% 15%)",
                    inputBorder: "hsl(217 33% 25%)",
                    inputBorderHover: "hsl(262 83% 58%)",
                    inputBorderFocus: "hsl(262 83% 58%)",
                    inputText: "hsl(43 96% 89%)",
                    inputPlaceholder: "hsl(43 42% 70%)",
                  },
                },
              },
              className: {
                container: "w-full",
                button: "w-full transition-all duration-300",
                input: "transition-all duration-300",
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Manage your Nimble V2 RPG characters with ease
        </p>
      </div>
    </div>
  );
};

export default Auth;
