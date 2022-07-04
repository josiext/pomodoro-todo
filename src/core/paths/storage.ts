import { LearningPath, Task } from "./types";

let STORAGE: LearningPath[] = [
  {
    id: "1",
    name: "Group 1",
    days: [true, true, true, true, true, true, true],
    nextSchedule: null,
    pomodoros: 6,
    tasks: [
      { id: "1", name: "Do this", completed: false },
      { id: "2", name: "Do this", completed: false },
      { id: "3", name: "Do this", completed: true },
    ],
  },
];

const create = async (
  item: Omit<LearningPath, "id">
): Promise<LearningPath> => {
  const newItem = { ...item, id: String(+new Date()) };
  STORAGE.push(newItem);
  return newItem;
};

const update = async (
  id: LearningPath["id"],
  data: Partial<Omit<LearningPath, "id">>
): Promise<LearningPath> => {
  const itemToUpdateIdx = STORAGE.findIndex((item) => item.id === id);
  if (itemToUpdateIdx === -1)
    throw new Error("Learning Path not found in Storage");

  STORAGE[itemToUpdateIdx] = {
    ...STORAGE[itemToUpdateIdx],
    ...data,
  };
  return STORAGE[itemToUpdateIdx];
};

const remove = async (id: LearningPath["id"]): Promise<LearningPath | null> => {
  const itemToRemove = STORAGE.find((item) => item.id === id);
  STORAGE.filter((item) => item.id !== id);
  return itemToRemove ?? null;
};

const find = async (): Promise<LearningPath[]> => {
  return STORAGE;
};

const findById = async (
  id: LearningPath["id"]
): Promise<LearningPath | null> => {
  const itemFound = STORAGE.find((item) => item.id === id);
  return itemFound ?? null;
};

const createTask = async (
  id: LearningPath["id"],
  item: Omit<Task, "id">
): Promise<LearningPath> => {
  const itemFound = STORAGE.find((item) => item.id === id);
  if (!itemFound) throw new Error("Path not found.");
  itemFound.tasks.push({ ...item, id: String(+new Date()) });
  return itemFound;
};

export const PathStorage = {
  create,
  update,
  remove,
  find,
  findById,
  createTask,
};
