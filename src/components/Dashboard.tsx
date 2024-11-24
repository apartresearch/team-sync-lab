import { User, Task, WeeklyUpdate, Stage } from "@/types";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";
import { DashboardCards } from "./dashboard/DashboardCards";

interface DashboardProps {
  user: User;
  stages: Stage[];
  tasks: Task[];
  updates: WeeklyUpdate[];
  headerActions?: React.ReactNode;
}

export function Dashboard({ user, stages, tasks, updates, headerActions }: DashboardProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <WelcomeHeader user={user} headerActions={headerActions} />
      <DashboardCards stages={stages} tasks={tasks} updates={updates} />
    </div>
  );
}