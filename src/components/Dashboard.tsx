import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Task, WeeklyUpdate, Stage } from "@/types";
import { Shield, ListChecks, MessageSquare, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DashboardProps {
  user: User;
  stages: Stage[];
  tasks: Task[];
  updates: WeeklyUpdate[];
  headerActions?: React.ReactNode;
}

export function Dashboard({ user, stages, tasks, updates, headerActions }: DashboardProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  const { data: userRole } = useQuery({
    queryKey: ['userRole', user.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('No user session');

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            name
          )
        `)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data?.roles?.name || 'Unknown';
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Track your research progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
            <Shield className="w-4 h-4" />
            <span className="capitalize">{userRole}</span>
          </div>
          {headerActions}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Overall Progress</h2>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Stage Status</h2>
          </div>
          <div className="space-y-3">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between">
                <span className="text-sm">{stage.name}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary capitalize">
                  {stage.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
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