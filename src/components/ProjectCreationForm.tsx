import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";

export type DeliverableType = 'paper' | 'blog_post' | 'funding_application' | 'hackathon_project';

export const DELIVERABLE_TYPES: { value: DeliverableType; label: string }[] = [
  { value: 'paper', label: 'Research Paper' },
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'funding_application', label: 'Funding Application' },
  { value: 'hackathon_project', label: 'Hackathon Project' },
];

export function ProjectCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const createProject = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Create project for each deliverable type
      const deliverables = DELIVERABLE_TYPES.map(type => ({
        title: `${title} - ${type.label}`,
        description,
        student_id: session.user.id,
        status: 'draft',
        stage: 'overview',
        type: type.value,
      }));

      // Insert projects first
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .insert(deliverables)
        .select();

      if (projectsError) throw projectsError;
      if (!projectsData) throw new Error("No projects were created");

      // Create project_members entries for each project
      const memberEntries = projectsData.map(project => ({
        project_id: project.id,
        user_id: session.user.id,
        role: 'owner'
      }));

      const { error: membersError } = await supabase
        .from("project_members")
        .insert(memberEntries);

      if (membersError) throw membersError;

      return projectsData;
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

  return (
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
  );
}