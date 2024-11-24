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

type Paper = Database['public']['Tables']['papers']['Row'];
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

  const { data: papers, isLoading } = useQuery({
    queryKey: ["papers"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("student_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Paper[];
    },
    enabled: !!session?.user?.id,
  });

  const createProject = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Create all deliverable types for this project
      const deliverables = DELIVERABLE_TYPES.map(type => ({
        title: `${title} - ${type.label}`,
        description,
        student_id: session.user.id,
        status: 'draft',
        stage: 'overview',
        type: type.value,
      }));

      const { data, error } = await supabase
        .from("papers")
        .insert(deliverables)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      setTitle("");
      setDescription("");
      toast({
        title: "Success",
        description: "Research project created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create research project: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate();
  };

  if (!session) {
    return null;
  }

  // Group papers by their base title (removing the type suffix)
  const groupedPapers = papers?.reduce((acc, paper) => {
    const baseTitle = paper.title.split(' - ')[0];
    if (!acc[baseTitle]) {
      acc[baseTitle] = [];
    }
    acc[baseTitle].push(paper);
    return acc;
  }, {} as Record<string, Paper[]>);

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
          Object.entries(groupedPapers || {}).map(([projectTitle, projectPapers]) => (
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