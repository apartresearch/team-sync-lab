import type { Database } from "@/integrations/supabase/types";

export type Project = Database['public']['Tables']['projects']['Row'];
export type DeliverableType = 'paper' | 'blog_post' | 'funding_application' | 'hackathon_project';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  stageId: string;
  requiredRole: 'student' | 'researcher' | 'advisor';
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'pending_review' | 'completed';
  reviewNotes?: string;
}

export interface WeeklyUpdate {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  ratings: Array<{
    userId: string;
    value: number;
  }>;
}