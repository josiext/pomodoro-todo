export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface WeekDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface LearningPath {
  id: string;
  name: string;
  tasks: Task[];
  days: WeekDays;
  pomodoros: number;
  nextSchedule: Date | null;
}
