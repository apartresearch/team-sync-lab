import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaperTodoList } from "@/components/PaperTodoList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultPaperTasks } from "@/config/defaultPaperTasks";

export default function PaperDetails() {
  const { paperId } = useParams();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", paperId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_members (
            user_id,
            role
          )
        `)
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
        .eq("project_id", paperId);
      
      if (error) throw error;
      return data;
    },
  });

  if (projectLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  const deliverableType = project?.type || 'paper';
  const stages = Object.keys(defaultPaperTasks[deliverableType]);
  const completedTasks = tasks?.filter(task => task.status === "completed")?.length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{project?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{project?.description}</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Overall Progress</p>
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={project?.stage || "overview"} className="space-y-4">
        <TabsList className="w-full justify-start">
          {stages.map((stage) => (
            <TabsTrigger 
              key={stage} 
              value={stage}
              className={stage === project?.stage ? "bg-primary text-primary-foreground" : ""}
            >
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {stages.map((stage) => (
          <TabsContent key={stage} value={stage}>
            <PaperTodoList 
              paperId={paperId!} 
              currentStage={stage} 
              isCurrentStage={stage === project?.stage}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}