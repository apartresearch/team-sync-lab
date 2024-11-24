import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];
type DeliverableType = 'paper' | 'blog_post' | 'funding_application' | 'hackathon_project';

const DELIVERABLE_TYPES: { value: DeliverableType; label: string }[] = [
  { value: 'paper', label: 'Research Paper' },
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'funding_application', label: 'Funding Application' },
  { value: 'hackathon_project', label: 'Hackathon Project' },
];

export function PaperManagement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) {
        navigate("/login");
        return null;
      }
      return session;
    },
  });

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Projects query error:", error);
        throw error;
      }
      
      console.log("Projects query successful:", data);
      return data as Project[];
    },
    enabled: !!session?.user?.id,
  });

  const createProject = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const deliverables = DELIVERABLE_TYPES.map(type => ({
        title: `${title} - ${type.label}`,
        description,
        student_id: session.user.id,
        status: 'draft',
        stage: 'overview',
        type: type.value,
      }));

      const { data, error } = await supabase
        .from("projects")
        .insert(deliverables)
        .select();

      if (error) {
        console.error("Project creation error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setTitle("");
      setDescription("");
      toast({
        title: "Success",
        description: "Research project created successfully",
      });
    },
    onError: (error) => {
      console.error("Project creation mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to create research project: " + error.message,
        variant: "destructive",
      });
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load projects: " + error.message,
      variant: "destructive",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate();
  };

  if (!session) {
    return null;
  }

  // Group projects by their base title (removing the type suffix)
  const groupedProjects = projects?.reduce((acc, project) => {
    const baseTitle = project.title.split(' - ')[0];
    if (!acc[baseTitle]) {
      acc[baseTitle] = [];
    }
    acc[baseTitle].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Research Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={createProject.isPending}>
              Create Research Project
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : (
          Object.entries(groupedProjects || {}).map(([projectTitle, projectPapers]) => (
            <Card 
              key={projectTitle}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{projectTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {projectPapers[0]?.description}
                  </p>
                  <div className="space-y-1">
                    {projectPapers.map((paper) => {
                      const typeInfo = DELIVERABLE_TYPES.find(t => t.value === paper.type);
                      return (
                        <div
                          key={paper.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary"
                          onClick={() => navigate(`/paper/${paper.id}`)}
                        >
                          <span className="text-sm font-medium">
                            {typeInfo?.label}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-background">
                            {paper.stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}