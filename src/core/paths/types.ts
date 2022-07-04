export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export interface LearningPath {
  id: string;
  name: string;
  tasks: Task[];
  days: boolean[];
  pomodoros: number;
  nextSchedule: Date | null;
}
