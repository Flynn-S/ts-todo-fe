export interface Task {
  id: string;
  task_name: string;
  description: string;
  dependencies: Task[];
  isCompleted: boolean;
  completed_at: Date | null;
}

export interface TaskModalProps {
  task?: Task | null;
  tasks: Task[];
  onClose: () => void;
  refetch: () => void;
  isModalOpen: boolean;
}
