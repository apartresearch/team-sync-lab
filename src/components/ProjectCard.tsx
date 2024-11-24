import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Project, DeliverableType } from "@/types";

const DELIVERABLE_TYPES: { value: DeliverableType; label: string }[] = [
  { value: 'paper', label: 'Research Paper' },
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'funding_application', label: 'Funding Application' },
  { value: 'hackathon_project', label: 'Hackathon Project' },
];

interface ProjectCardProps {
  title: string;
  description: string;
  papers: Project[];
}

export function ProjectCard({ title, description, papers }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="space-y-1">
            {papers.map((paper) => {
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
  );
}