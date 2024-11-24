import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

const isDevelopment = import.meta.env.DEV;

export function DiscordAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDiscordLogin = async () => {
    try {
      if (isDevelopment) {
        // In development, use a direct sign-in with a mock user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'dev@example.com',
          password: 'development-password',
        });

        if (error) {
          // If the user doesn't exist, create it
          if (error.message.includes('Invalid login credentials')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: 'dev@example.com',
              password: 'development-password',
            });

            if (signUpError) {
              throw signUpError;
            }

            toast({
              title: "Development Account Created",
              description: "You can now use the development account to test the application.",
            });
            
            // Directly navigate to callback to handle role assignment
            navigate('/auth/callback');
            return;
          }
          throw error;
        }

        navigate('/');
      } else {
        // In production, use Discord OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'identify email',
          }
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Authentication Error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleDiscordLogin}
      className="bg-[#5865F2] hover:bg-[#4752C4] text-white w-full"
    >
      <Icons.discord className="mr-2 h-4 w-4" />
      {isDevelopment ? "Use Development Account" : "Sign in with Discord"}
    </Button>
  );
}