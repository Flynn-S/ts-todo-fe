export interface Task {
  id: number;
  task_name: string;
  description: string;
  isCompleted: boolean;
  completed_at: Date | null;
}

export interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  refetch: () => void;
  isModalOpen: boolean;
}
