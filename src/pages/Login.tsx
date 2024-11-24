import { DiscordAuth } from "@/components/DiscordAuth";
import { Card } from "@/components/ui/card";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 space-y-6 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">
            Sign in to track your research progress
          </p>
        </div>
        <DiscordAuth />
      </Card>
    </div>
  );
}