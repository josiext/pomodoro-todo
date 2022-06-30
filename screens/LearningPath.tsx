import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

interface ILearningPath {
  id: string;
  name: string;
  tasks: { id: string; name: string; completed: boolean }[];
}

const paths: ILearningPath[] = [
  {
    id: "1",
    name: "Group 1",
    tasks: [
      { id: "1", name: "Do this", completed: false },
      { id: "2", name: "Do this", completed: false },
      { id: "3", name: "Do this", completed: true },
    ],
  },
  {
    id: "2",
    name: "Group 2",
    tasks: [
      { id: "1", name: "Do this", completed: false },
      { id: "2", name: "Do this", completed: false },
      { id: "3", name: "Do this", completed: true },
    ],
  },
  {
    id: "3",
    name: "Group 3",
    tasks: [
      { id: "1", name: "Do this", completed: false },
      { id: "2", name: "Do this", completed: false },
      { id: "3", name: "Do this", completed: true },
    ],
  },
];

export default function LearningPath({
  navigation,
}: RootTabScreenProps<"LearningPath">) {
  const [groupOpened, setGroupOpened] = useState<typeof paths[0]["id"] | null>(
    null
  );

  const handleToggleTaskList = (id: string) => {
    if (groupOpened === id) setGroupOpened(null);
    else setGroupOpened(id);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {paths.map((path) => (
          <Path
            path={path}
            showTasks={path.id === groupOpened}
            toggleShowTasks={handleToggleTaskList}
            key={path.id}
          />
        ))}
      </View>

      <TouchableOpacity style={{ padding: 10 }}>
        <Text>Create</Text>
      </TouchableOpacity>
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
          <Text style={{ fontSize: 18, fontWeight: "500" }}>{path.name}</Text>

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

            <Ionicons name="chevron-down-outline" size={24} color="gray" />
          </View>
        </View>

        {showTasks && (
          <View>
            {path.tasks.map((task) => (
              <View key={task.id}>
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
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
