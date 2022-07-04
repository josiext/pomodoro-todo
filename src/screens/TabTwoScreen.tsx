import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import * as TaskManager from "expo-task-manager";

const POMODORO_TASK_NAME = "pomodoro-task";

TaskManager.defineTask(POMODORO_TASK_NAME, ({ data, error }) => {
  console.log("hla");
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    console.log("aquí");
  }
});

export default function Pomodoro() {
  const [pomodoroInterval, setPomodoroInterval] = useState<NodeJS.Timer | null>(
    null
  );
  const [pomodoroTimer, setPomodoroTimer] = useState(1500);

  const handleStart = () => {
    console.log("1");

    /* 
    const interval = setInterval(() => {
      setPomodoroTimer((prev) => prev - 1);
    }, 1000);
    setPomodoroInterval(interval); */
  };

  const handleEnd = () => {
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    setPomodoroInterval(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 36 }}>
        {giveCronometerFormat(pomodoroTimer)}
      </Text>

      <Button
        title={pomodoroInterval ? "End" : "Start"}
        onPress={() => (pomodoroInterval ? handleEnd() : handleStart())}
      />
    </View>
  );
}

type ButtonProps = { title: string } & TouchableOpacity["props"];

function Button({ title, ...props }: ButtonProps) {
  return (
    <TouchableOpacity style={{ padding: 12 }} {...props}>
      <Text style={{ fontSize: 24 }}>{title}</Text>
    </TouchableOpacity>
  );
}

const giveCronometerFormat = (sec: number) => {
  const minutes = Math.trunc(sec / 60);
  const seconds = sec % 60;

  return `${minutes}:${seconds}`;
};
