import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

export function DiscordAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDiscordLogin = async () => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo,
          scopes: 'identify email',
        }
      });

      if (error) throw error;
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
      Sign in with Discord
    </Button>
  );
}