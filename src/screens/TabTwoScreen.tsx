import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { Text, View } from "../components/Themed";
import PomodoroButton from "../components/PomodoroButton";

const POMODORO_DEFAULT_TIMER = 5;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Pomodoro() {
  const appState = useRef(AppState.currentState);
  const lastBackground = useRef<Date>(new Date());

  const [pomodoroInterval, setPomodoroInterval] = useState<NodeJS.Timer | null>(
    null
  );
  const [pomodoroTimer, setPomodoroTimer] = useState(POMODORO_DEFAULT_TIMER);

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === "background") {
        lastBackground.current = new Date();
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const secondsInBackground =
          new Date().getSeconds() - lastBackground.current.getSeconds();
        setPomodoroTimer((prev) =>
          prev - secondsInBackground < 0 ? 0 : prev - secondsInBackground
        );
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (pomodoroTimer <= 0) {
      schedulePushNotification();
      handleRestart();
    }
  }, [pomodoroTimer]);

  const handleStart = () => {
    const interval = setInterval(() => {
      setPomodoroTimer((prev) => prev - 1);
    }, 1000);
    setPomodoroInterval(interval);
  };

  const handlePause = () => {
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    setPomodoroInterval(null);
  };

  const handleRestart = () => {
    handlePause();
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

const giveCronometerFormat = (sec: number) => {
  const minutes = Math.trunc(sec / 60);
  const seconds = sec % 60;

  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🍅 Time up!!",
      body: "Your pomodoro has finished!",
    },
    trigger: { seconds: 0 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
