import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Award, Trophy, Medal, Star, BookmarkCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Achievement {
  id: string;
  type: string;
  points: number;
  title: string;
  description: string;
  earned_at: string | null;
}

const achievementIcons: Record<string, React.ComponentType<any>> = {
  paper_published: Trophy,
  review_completed: BookmarkCheck,
  blog_posted: Star,
  funding_secured: Award,
  hackathon_completed: Medal,
  first_submission: Star,
  collaboration_started: BookmarkCheck,
  mentor_assigned: Award,
};

export function AchievementsTab() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points", { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {achievements?.map((achievement) => {
        const Icon = achievementIcons[achievement.type] || Trophy;
        const isUnlocked = achievement.earned_at !== null;

        return (
          <Card
            key={achievement.id}
            className={`p-6 ${
              isUnlocked
                ? "bg-secondary/50 border-primary/20"
                : "opacity-50 grayscale"
            } transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  isUnlocked ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <Icon className={`w-6 h-6 ${isUnlocked ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {achievement.points} pts
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>
                {isUnlocked && (
                  <p className="text-xs text-primary mt-2">
                    Unlocked on{" "}
                    {new Date(achievement.earned_at!).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}