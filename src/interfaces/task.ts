export interface Task {
  id: number;
  task_name: string;
  description: string;
  isCompleted: boolean;
  completed_at: Date;
}
