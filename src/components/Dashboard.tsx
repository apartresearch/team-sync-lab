import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Task, WeeklyUpdate } from "@/types";
import { Shield, ListChecks, MessageSquare } from "lucide-react";

interface DashboardProps {
  user: User;
  tasks: Task[];
  updates: WeeklyUpdate[];
}

export function Dashboard({ user, tasks, updates }: DashboardProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Track your research progress</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
          <Shield className="w-4 h-4" />
          <span className="capitalize">{user.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Task Progress</h2>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Latest Updates</h2>
          </div>
          <div className="space-y-2">
            {updates.slice(0, 3).map((update) => (
              <p key={update.id} className="text-sm text-muted-foreground truncate">
                {update.content}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}