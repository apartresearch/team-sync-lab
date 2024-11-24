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
        // First create the user if it doesn't exist
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'dev@example.com',
          password: 'development-password',
          options: {
            data: {
              email_confirmed_at: new Date().toISOString(),
            }
          }
        });

        // Ignore "User already registered" error
        if (signUpError && !signUpError.message.includes('User already registered')) {
          throw signUpError;
        }

        // Then sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'dev@example.com',
          password: 'development-password',
        });

        if (signInError) throw signInError;

        // If we get here, we're signed in successfully
        navigate('/');
      } else {
        const redirectTo = window.location.origin + '/auth/callback';
        // In production, use Discord OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo,
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