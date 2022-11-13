import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { Text, View } from "../components/Themed";
import PomodoroButton from "../components/PomodoroButton";
import giveCronometerFormat from "../utils/time/cronometerFormat";

const POMODORO_DEFAULT_TIMER = 5;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Pomodoro() {
  const appState = useRef(AppState.currentState);
  const lastBackground = useRef<Date>(new Date());
  const currentBackgroundNotification = useRef<null | string>(null);

  const [pomodoroInterval, setPomodoroIntervalFunction] =
    useState<NodeJS.Timer | null>(null);
  const [pomodoroTimer, setPomodoroTimer] = useState(POMODORO_DEFAULT_TIMER);

  const aux = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/active/) && nextAppState === "background") {
      // When app change to background state
      lastBackground.current = new Date();
      const id = await schedulePushNotification(pomodoroTimer);
      currentBackgroundNotification.current = id;
    }

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      const activeNotify = currentBackgroundNotification.current;
      if (activeNotify) {
        Notifications.cancelScheduledNotificationAsync(activeNotify);
      }

      const secondsInBackground =
        new Date().getSeconds() - lastBackground.current.getSeconds();
      setPomodoroTimer((prev) => {
        if (prev - secondsInBackground <= 0) {
          if (pomodoroInterval) clearInterval(pomodoroInterval);
          setPomodoroIntervalFunction(null);
          return POMODORO_DEFAULT_TIMER;
        } else {
          return prev - secondsInBackground;
        }
      });
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", aux);

    return () => {
      subscription.remove();
    };
  }, [aux]);

  useEffect(() => {
    if (pomodoroTimer <= 0) {
      handleRestart();
    }
  }, [pomodoroTimer]);

  const handleStart = () => {
    const interval = setInterval(() => {
      setPomodoroTimer((prev) => prev - 1);
    }, 1000);
    setPomodoroIntervalFunction(interval);
  };

  const handlePause = () => {
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    setPomodoroIntervalFunction(null);
  };

  const handleRestart = () => {
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    setPomodoroIntervalFunction(null);
    setPomodoroTimer(POMODORO_DEFAULT_TIMER);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 46 }}>
        {giveCronometerFormat(pomodoroTimer)}
      </Text>

      <View style={{ flexDirection: "row", marginTop: 24 }}>
        <PomodoroButton
          title={pomodoroInterval ? "End" : "Start"}
          onPress={() => (pomodoroInterval ? handlePause() : handleStart())}
        />

        <PomodoroButton title="Reset" onPress={() => handleRestart()} />
      </View>
    </View>
  );
}

function schedulePushNotification(delayInSeconds: number) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "🍅 Time up!!",
      body: "Your pomodoro has finished!",
    },
    trigger: { seconds: delayInSeconds },
  });
}
