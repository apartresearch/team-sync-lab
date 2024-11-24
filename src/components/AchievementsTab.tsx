import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Award, Trophy, Medal, Star, BookmarkCheck, XCircle, Check, Crown } from "lucide-react";
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
  paper_rejected: XCircle,
  workshop_accepted: Check,
  conference_accepted: Trophy,
  best_paper: Crown,
};

// Define all possible achievements
const defaultAchievements: Omit<Achievement, 'earned_at'>[] = [
  {
    id: 'paper_published',
    type: 'paper_published',
    points: 100,
    title: 'First Paper Published',
    description: 'Successfully published your first research paper'
  },
  {
    id: 'review_completed',
    type: 'review_completed',
    points: 50,
    title: 'Review Master',
    description: 'Completed your first peer review'
  },
  {
    id: 'blog_posted',
    type: 'blog_posted',
    points: 30,
    title: 'Blogger',
    description: 'Posted your first research blog'
  },
  {
    id: 'funding_secured',
    type: 'funding_secured',
    points: 150,
    title: 'Grant Winner',
    description: 'Secured your first research funding'
  },
  {
    id: 'hackathon_completed',
    type: 'hackathon_completed',
    points: 75,
    title: 'Hackathon Hero',
    description: 'Participated in your first research hackathon'
  },
  {
    id: 'first_submission',
    type: 'first_submission',
    points: 40,
    title: 'First Steps',
    description: 'Submitted your first paper draft'
  },
  {
    id: 'collaboration_started',
    type: 'collaboration_started',
    points: 60,
    title: 'Team Player',
    description: 'Started your first research collaboration'
  },
  {
    id: 'mentor_assigned',
    type: 'mentor_assigned',
    points: 25,
    title: 'Mentee',
    description: 'Got assigned your first research mentor'
  },
  {
    id: 'paper_rejected',
    type: 'paper_rejected',
    points: 20,
    title: 'Fail Faster',
    description: 'Successfully get a paper rejected from a workshop or conference'
  },
  {
    id: 'workshop_accepted',
    type: 'workshop_accepted',
    points: 80,
    title: 'Workshop Warrior',
    description: 'Had your first paper accepted at a workshop'
  },
  {
    id: 'conference_accepted',
    type: 'conference_accepted',
    points: 120,
    title: 'Champion',
    description: 'Got your first paper accepted at a conference main track'
  },
  {
    id: 'best_paper',
    type: 'best_paper',
    points: 200,
    title: 'Legend',
    description: 'Received a best paper award at a machine learning conference'
  }
];

export function AchievementsTab() {
  const { data: earnedAchievements, isLoading } = useQuery({
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

  // Combine earned achievements with default achievements
  const allAchievements = defaultAchievements.map(defaultAchievement => {
    const earnedAchievement = earnedAchievements?.find(
      earned => earned.type === defaultAchievement.type
    );
    return {
      ...defaultAchievement,
      earned_at: earnedAchievement?.earned_at || null
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {allAchievements.map((achievement) => {
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