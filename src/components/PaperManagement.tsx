import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { ProjectCreationForm } from "./ProjectCreationForm";
import { ProjectList } from "./ProjectList";

type Project = Database['public']['Tables']['projects']['Row'];

export function PaperManagement() {
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

  const { data: projects, isLoading } = useQuery({
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

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProjectCreationForm />
      {isLoading ? (
        <p>Loading projects...</p>
      ) : (
        <ProjectList projects={projects || []} />
      )}
    </div>
  );
}