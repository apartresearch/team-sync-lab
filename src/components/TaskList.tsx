import { useState } from "react";
import { Task, UserRole } from "@/types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  userRole: UserRole;
  onTaskComplete: (taskId: string) => void;
}

export function TaskList({ tasks, userRole, onTaskComplete }: TaskListProps) {
  const roleLevel = { student: 0, researcher: 1, advisor: 2 };
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isLocked = roleLevel[userRole] < roleLevel[task.requiredRole];
        
        return (
          <Card key={task.id} className="p-4">
            <div className="flex items-center gap-4">
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
          </Card>
        );
      })}
    </div>
  );
}