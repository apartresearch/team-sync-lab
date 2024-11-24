import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface PaperTodoListProps {
  paperId: string;
  currentStage: string;
}

export function PaperTodoList({ paperId, currentStage }: PaperTodoListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: userRole } = useUserRole();
  const isAdvisor = userRole === "advisor";

  const { data: tasks } = useQuery({
    queryKey: ["paper-tasks", paperId],
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
      const stages = ["overview", "research", "writing", "review", "final"];
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks - {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks?.map((task) => (
          <div key={task.id} className="flex items-center space-x-2">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={(checked) => {
                updateTaskStatus.mutate({
                  taskId: task.id,
                  completed: checked as boolean,
                });
              }}
            />
            <span className="flex-1">{task.title}</span>
          </div>
        ))}

        {isAdvisor && allTasksCompleted && (
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