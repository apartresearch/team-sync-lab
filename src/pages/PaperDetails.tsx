import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaperTodoList } from "@/components/PaperTodoList";

export default function PaperDetails() {
  const { paperId } = useParams();

  const { data: paper, isLoading: paperLoading } = useQuery({
    queryKey: ["paper", paperId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("id", paperId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["paper-tasks", paperId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paper_tasks")
        .select("*")
        .eq("paper_id", paperId);
      
      if (error) throw error;
      return data;
    },
  });

  if (paperLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  const completedTasks = tasks?.filter(task => task.status === "completed")?.length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{paper?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{paper?.description}</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Progress</p>
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      <PaperTodoList paperId={paperId!} currentStage={paper?.stage || "overview"} />
    </div>
  );
}