import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { DeliverableType } from "@/types";

const DELIVERABLE_TYPES: { value: DeliverableType; label: string }[] = [
  { value: 'paper', label: 'Research Paper' },
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'funding_application', label: 'Funding Application' },
  { value: 'hackathon_project', label: 'Hackathon Project' },
];

export function CreateProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
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

      if (error) throw error;
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