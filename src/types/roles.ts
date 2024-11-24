export interface Role {
  id: number;
  name: string;
  created_at: string;
}

export interface UserRole {
  id: number;
  user_id: string;
  role_id: number;
  created_at: string;
}