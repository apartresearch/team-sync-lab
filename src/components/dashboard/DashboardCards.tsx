import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Stage, Task, WeeklyUpdate } from "@/types";
import { Shield, ListChecks, MessageSquare, CheckCircle2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardCardsProps {
  stages: Stage[];
  tasks: Task[];
  updates: WeeklyUpdate[];
}

export function DashboardCards({ stages, tasks, updates }: DashboardCardsProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-left">Overall Progress</h2>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/docs/progress" className="text-muted-foreground hover:text-foreground">
                  <BookOpen className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn about Progress Tracking</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground text-left">
          {completedTasks} of {tasks.length} tasks completed
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-left">Stage Status</h2>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/docs/stages" className="text-muted-foreground hover:text-foreground">
                  <BookOpen className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn about Research Stages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between">
              <span className="text-sm text-left">{stage.name}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary capitalize">
                {stage.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-left">Latest Updates</h2>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/docs/updates" className="text-muted-foreground hover:text-foreground">
                  <BookOpen className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn about Weekly Updates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          {updates.slice(0, 3).map((update) => (
            <p key={update.id} className="text-sm text-muted-foreground text-left truncate">
              {update.content}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}