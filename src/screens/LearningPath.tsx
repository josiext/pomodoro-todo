import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, View, TextInput, useThemeColor } from "../components/Themed";
import { RootTabScreenProps } from "../../types";
import { LearningPath as ILearningPath } from "../core/paths/types";
import { PathStorage } from "../core/paths/storage";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

const POMODORO_DAYS = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
} as const;

const DEFAULT_NEW_PATH = {
  days: [true, true, true, true, true, true, true],
  name: "",
  nextSchedule: new Date(),
  pomodoros: 2,
  tasks: [],
};

export default function LearningPath({
  navigation,
}: RootTabScreenProps<"LearningPath">) {
  const [learningPaths, setLearningPaths] = useState<ILearningPath[]>([]);
  const [groupOpened, setGroupOpened] = useState<ILearningPath["id"] | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [newPath, setNewPath] =
    useState<Omit<ILearningPath, "id">>(DEFAULT_NEW_PATH);

  useEffect(() => {
    PathStorage.find().then(setLearningPaths);
  }, []);

  const handleToggleTaskList = (id: string) => {
    if (groupOpened === id) setGroupOpened(null);
    else setGroupOpened(id);
  };

  const handleCreatePath = async () => {
    const path = await PathStorage.create(newPath);
    setLearningPaths([...learningPaths, path]);
    setModalVisible(false);
    setNewPath(DEFAULT_NEW_PATH);
  };

  const handlePressDay =
    (day: typeof POMODORO_DAYS[keyof typeof POMODORO_DAYS]) => () => {};

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {learningPaths.map((path) => (
          <Path
            path={path}
            showTasks={path.id === groupOpened}
            toggleShowTasks={handleToggleTaskList}
            key={path.id}
          />
        ))}
      </View>

      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => setModalVisible(true)}
      >
        <Text>Create</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 24, marginBottom: 16 }}>
              New Learning Path
            </Text>

            <TextInput
              placeholder="Name"
              value={newPath.name}
              onChangeText={(txt) => setNewPath({ ...newPath, name: txt })}
              style={{ marginBottom: 12 }}
            />

            <View style={{ flexDirection: "row" }}>
              <DayButton
                label="Mon"
                onPress={() => setNewPath({ ...newPath, days: newPath.days })}
              />
              <DayButton
                label="Tue"
                onPress={() => setNewPath({ ...newPath, days: [] })}
              />
              <DayButton
                label="Wed"
                onPress={() => setNewPath({ ...newPath, days: [] })}
              />
              <DayButton
                label="Thu"
                onPress={() => setNewPath({ ...newPath, days: [] })}
              />
              <DayButton
                label="Fri"
                onPress={() => setNewPath({ ...newPath, days: [] })}
              />
              <DayButton
                label="Sat"
                onPress={() => setNewPath({ ...newPath, days: [] })}
              />
              <DayButton
                label="Sun"
                onPress={() => setNewPath({ ...newPath, days: [] })}
              />
            </View>

            <TextInput
              placeholder="Pomodoros"
              value={String(newPath.pomodoros)}
              onChangeText={(value) =>
                setNewPath({ ...newPath, pomodoros: Number(value) })
              }
              style={{ marginTop: 12 }}
              keyboardType="numeric"
            />

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleCreatePath()}
            >
              <Text style={styles.textStyle}>Create</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 16,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export function Path({
  path,
  toggleShowTasks,
  showTasks,
}: {
  path: ILearningPath;
  toggleShowTasks: (id: string) => void;
  showTasks: boolean;
}) {
  return (
    <TouchableOpacity
      key={path.id}
      style={{
        paddingHorizontal: 4,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "lightgray",
      }}
      onPress={() => toggleShowTasks(path.id)}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="chevron-down-outline"
              style={{ marginRight: 6 }}
              size={16}
              color="gray"
            />

            <Text style={{ fontSize: 18, fontWeight: "500" }}>{path.name}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 8,
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginRight: 8,
              }}
            >
              <Ionicons name="construct-outline" size={24} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginRight: 8,
              }}
            >
              <Ionicons name="close-circle-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {showTasks && (
          <View style={{ paddingTop: 6 }}>
            {path.tasks.length > 0 ? (
              path.tasks.map((task) => (
                <View key={task.id} style={{ paddingVertical: 4 }}>
                  <Text
                    style={{
                      textDecorationLine: task.completed
                        ? "line-through"
                        : "none",
                      fontSize: 18,
                    }}
                  >
                    {task.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 14, fontStyle: "italic" }}>
                No tasks.
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function DayButton({
  label,
  onPress,
  isSelected,
}: {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
}) {
  const backgroundColor = isSelected
    ? useThemeColor({}, "highlight")
    : "transparent";

  return (
    <TouchableOpacity
      style={{ padding: 4, borderRadius: 5, backgroundColor }}
      onPress={onPress}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}
