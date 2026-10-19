export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  dueDate?: string; // YYYY-MM-DD or ISO string
  subtasks: SubTask[];
  completedAt?: string | null;
  position: number;
  createdAt: string;
}

export type ViewMode = 'list' | 'kanban' | 'insights';

export type CategoryFilter = 'all' | string;
export type PriorityFilter = 'all' | Priority;
export type StatusFilter = 'all' | TaskStatus;
