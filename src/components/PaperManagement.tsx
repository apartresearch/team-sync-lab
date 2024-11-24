import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { CreateProjectForm } from "./CreateProjectForm";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types";

export function PaperManagement() {
  const { toast } = useToast();
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
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load projects: " + error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
      <CreateProjectForm />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : (
          Object.entries(groupedProjects || {}).map(([projectTitle, projectPapers]) => (
            <ProjectCard
              key={projectTitle}
              title={projectTitle}
              description={projectPapers[0]?.description || ""}
              papers={projectPapers}
            />
          ))
        )}
      </div>
    </div>
  );
}