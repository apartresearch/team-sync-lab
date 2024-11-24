import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/types";

interface WelcomeHeaderProps {
  user: User;
  headerActions?: React.ReactNode;
}

export function WelcomeHeader({ user, headerActions }: WelcomeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold text-left">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground text-left">Track your research progress</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/docs" className="text-muted-foreground hover:text-foreground">
                <BookOpen className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-4">
        {headerActions}
      </div>
    </div>
  );
}