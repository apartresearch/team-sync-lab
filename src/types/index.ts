export type UserRole = 'student' | 'researcher' | 'advisor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  requiredRole: UserRole;
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