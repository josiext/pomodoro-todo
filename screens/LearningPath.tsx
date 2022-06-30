import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

const paths = [
  {
    id: "1",
    name: "Group1",
    tasks: [
      { id: "1", name: "Do this", completed: false },
      { id: "2", name: "Do this", completed: false },
      { id: "3", name: "Do this", completed: false },
    ],
  },
];

export default function LearningPath({
  navigation,
}: RootTabScreenProps<"LearningPath">) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {paths.map((path) => (
          <View key={path.id}>
            <Text>{path.name}</Text>
          </View>
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
