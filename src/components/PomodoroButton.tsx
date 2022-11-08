import { TouchableOpacity, Text } from "react-native";

type ButtonProps = { title: string } & TouchableOpacity["props"];

export default function PomodoroButton({ title, ...props }: ButtonProps) {
  return (
    <TouchableOpacity style={{ padding: 12 }} {...props}>
      <Text style={{ fontSize: 24 }}>{title}</Text>
    </TouchableOpacity>
  );
}
