import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-200 dark:bg-primary-900">
        <Text className="font-bold text-primary-500 dark:text-primary-200 text-5xl">Welcome!</Text>
    </View>
  );
}
