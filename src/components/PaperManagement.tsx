import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [type, setType] = useState<DeliverableType>('paper');
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
            type,
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
        description: "Deliverable created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create deliverable: " + error.message,
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
          <CardTitle>Create New Deliverable</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Select
                value={type}
                onValueChange={(value) => setType(value as DeliverableType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERABLE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={createPaper.isPending}>
              Create Deliverable
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading deliverables...</p>
        ) : (
          papers?.map((paper) => {
            const typeInfo = DELIVERABLE_TYPES.find(t => t.value === paper.type);
            return (
              <Card 
                key={paper.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/paper/${paper.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{paper.title}</CardTitle>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {typeInfo?.label || paper.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{paper.description}</p>
                  <p className="text-sm mt-2">Status: {paper.status}</p>
                  <p className="text-sm">Stage: {paper.stage}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
}