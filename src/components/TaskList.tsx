import { useState } from "react";
import { Task, Stage } from "@/types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TaskListProps {
  tasks: Task[];
  stages: Stage[];
  onTaskComplete: (taskId: string) => void;
  onRequestReview: (stageId: string) => void;
}

export function TaskList({ tasks, stages, onTaskComplete, onRequestReview }: TaskListProps) {
  const [expandedStages, setExpandedStages] = useState<string[]>(stages.map(s => s.id));
  const roleLevel = { student: 0, researcher: 1, advisor: 2 };

  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
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
      return data?.roles?.name?.toLowerCase() || 'student';
    },
  });

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev =>
      prev.includes(stageId)
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };
  
  return (
    <div className="space-y-6">
      {stages.map((stage) => {
        const stageTasks = tasks.filter(task => task.stageId === stage.id);
        const isExpanded = expandedStages.includes(stage.id);
        const allTasksCompleted = stageTasks.every(task => task.completed);
        const canRequestReview = allTasksCompleted && stage.status === 'in_progress';
        
        return (
          <Card key={stage.id} className="p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleStage(stage.id)}
            >
              <div className="space-y-1">
                <h3 className="font-medium">{stage.name}</h3>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-1 rounded-full bg-secondary capitalize">
                  {stage.status.replace('_', ' ')}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                {stageTasks.map((task) => {
                  const isLocked = roleLevel[userRole || 'student'] < roleLevel[task.requiredRole];
                  
                  return (
                    <div key={task.id} className="flex items-center gap-4">
                      <Checkbox
                        checked={task.completed}
                        disabled={isLocked}
                        onCheckedChange={() => onTaskComplete(task.id)}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      {isLocked && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Lock className="w-4 h-4" />
                          <span>Requires {task.requiredRole} role</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {canRequestReview && userRole !== 'advisor' && (
                  <Button
                    onClick={() => onRequestReview(stage.id)}
                    className="w-full mt-4"
                  >
                    Request Review
                  </Button>
                )}

                {stage.reviewNotes && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <p className="text-sm font-medium">Review Notes:</p>
                    <p className="text-sm text-muted-foreground">{stage.reviewNotes}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}