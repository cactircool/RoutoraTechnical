import { dark, light } from "@/constants/Themes";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <BottomSheetModalProvider>
        <ThemeProvider value={ colorScheme === 'dark' ? dark : light }>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </PaperProvider>
  );
}
