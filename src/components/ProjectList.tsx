import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";
import { DELIVERABLE_TYPES } from "./ProjectCreationForm";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const navigate = useNavigate();

  // Group projects by their base title (removing the type suffix)
  const groupedProjects = projects.reduce((acc, project) => {
    const baseTitle = project.title.split(' - ')[0];
    if (!acc[baseTitle]) {
      acc[baseTitle] = [];
    }
    acc[baseTitle].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(groupedProjects).map(([projectTitle, projectItems]) => (
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
                {projectItems[0]?.description}
              </p>
              <div className="space-y-1">
                {projectItems.map((project) => {
                  const typeInfo = DELIVERABLE_TYPES.find(t => t.value === project.type);
                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary"
                      onClick={() => navigate(`/paper/${project.id}`)}
                    >
                      <span className="text-sm font-medium">
                        {typeInfo?.label}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-background">
                        {project.stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}