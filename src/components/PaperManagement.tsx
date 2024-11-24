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

  const createPaper = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("papers")
        .insert([
          {
            title,
            description,
            student_id: session.user.id,
            status: 'draft',
            stage: 'overview',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      setTitle("");
      setDescription("");
      toast({
        title: "Success",
        description: "Paper created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create paper: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPaper.mutate();
  };

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Paper Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Paper Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={createPaper.isPending}>
              Create Paper
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading papers...</p>
        ) : (
          papers?.map((paper) => (
            <Card 
              key={paper.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/paper/${paper.id}`)}
            >
              <CardHeader>
                <CardTitle>{paper.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{paper.description}</p>
                <p className="text-sm mt-2">Status: {paper.status}</p>
                <p className="text-sm">Stage: {paper.stage}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}