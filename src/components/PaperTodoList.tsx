import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { defaultPaperTasks } from "@/config/defaultPaperTasks";

interface PaperTodoListProps {
  paperId: string;
  currentStage: string;
  isCurrentStage: boolean;
}

export function PaperTodoList({ paperId, currentStage, isCurrentStage }: PaperTodoListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: userRole } = useUserRole();
  const isAdvisor = userRole === "advisor";

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["paper-tasks", paperId, currentStage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paper_tasks")
        .select("*")
        .eq("paper_id", paperId)
        .eq("stage", currentStage);
      
      if (error) throw error;
      return data;
    },
  });

  const createDefaultTasks = useMutation({
    mutationFn: async () => {
      const { data: paperData } = await supabase
        .from("papers")
        .select("student_id, type")
        .eq("id", paperId)
        .single();

      if (!paperData) throw new Error("Paper not found");

      const deliverableType = paperData.type || 'paper';
      const defaultTasks = defaultPaperTasks[deliverableType][currentStage] || [];
      
      const tasksToCreate = defaultTasks.map(task => ({
        paper_id: paperId,
        title: task.title,
        description: task.description,
        stage: currentStage,
        assigned_to: paperData.student_id,
        status: "pending"
      }));

      const { error } = await supabase
        .from("paper_tasks")
        .insert(tasksToCreate);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paper-tasks", paperId] });
    },
  });

  useEffect(() => {
    if (!isLoading && (!tasks || tasks.length === 0)) {
      createDefaultTasks.mutate();
    }
  }, [tasks, isLoading]);

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from("paper_tasks")
        .update({ status: completed ? "completed" : "pending" })
        .eq("id", taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paper-tasks", paperId] });
    },
  });

  const advanceStage = useMutation({
    mutationFn: async () => {
      const { data: paperData } = await supabase
        .from("papers")
        .select("type")
        .eq("id", paperId)
        .single();

      if (!paperData) throw new Error("Paper not found");

      const deliverableType = paperData.type || 'paper';
      const stages = Object.keys(defaultPaperTasks[deliverableType]);
      const currentIndex = stages.indexOf(currentStage);
      const nextStage = stages[currentIndex + 1];

      if (!nextStage) throw new Error("Already at final stage");

      const { error } = await supabase
        .from("papers")
        .update({ stage: nextStage })
        .eq("id", paperId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paper", paperId] });
      toast({
        title: "Success",
        description: "Paper advanced to next stage",
      });
    },
  });

  const allTasksCompleted = tasks?.every(task => task.status === "completed");

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks - {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks?.map((task) => (
          <div key={task.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={(checked) => {
                  if (isCurrentStage) {
                    updateTaskStatus.mutate({
                      taskId: task.id,
                      completed: checked as boolean,
                    });
                  }
                }}
                disabled={!isCurrentStage}
              />
              <span className={`font-medium ${!isCurrentStage && "text-muted-foreground"}`}>
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground ml-6">{task.description}</p>
            )}
          </div>
        ))}

        {isAdvisor && isCurrentStage && allTasksCompleted && (
          <Button 
            onClick={() => advanceStage.mutate()}
            className="w-full mt-4"
          >
            Advance to Next Stage
          </Button>
        )}
      </CardContent>
    </Card>
  );
}