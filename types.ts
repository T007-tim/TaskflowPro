
export enum TaskStatus {
  INCOMPLETE = 'Incomplete',
  IN_PROGRESS = 'In Progress',
  DUE = 'Due',
  COMPLETE = 'Complete'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  dueDate: string;
  parentId: string | null;
  createdAt: string;
}

export interface AppState {
  tasks: Task[];
  labels: string[];
}
