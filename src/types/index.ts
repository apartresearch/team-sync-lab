export type UserRole = 'student' | 'researcher' | 'advisor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export type StageStatus = 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected';

export interface Stage {
  id: string;
  name: string;
  description: string;
  status: StageStatus;
  tasks: Task[];
  reviewerId?: string;
  reviewNotes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  requiredRole: UserRole;
  stageId: string;
}

export interface WeeklyUpdate {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  ratings: Rating[];
}

export interface Rating {
  userId: string;
  value: number;
}