import type { Database } from "@/integrations/supabase/types";

export type Project = Database['public']['Tables']['projects']['Row'];
export type DeliverableType = 'paper' | 'blog_post' | 'funding_application' | 'hackathon_project';