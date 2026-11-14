export interface Task {
  id: number;
  group_id: number;
  column_id: number;
  column_name?: string;
  assigned_to: number | null;
  assigned_name?: string | null;
  title: string;
  description: string | null;
  created_at: string;
}
