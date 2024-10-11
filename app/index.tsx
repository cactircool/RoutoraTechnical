import Loading from "@/components/Loading";
import { useFonts, Roboto_100Thin, Roboto_100Thin_Italic, Roboto_300Light, Roboto_300Light_Italic, Roboto_400Regular, Roboto_400Regular_Italic, Roboto_500Medium, Roboto_500Medium_Italic, Roboto_700Bold, Roboto_700Bold_Italic, Roboto_900Black, Roboto_900Black_Italic } from "@expo-google-fonts/dev";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { ThemedText } from "@/components/ThemedText";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [loaded, error] = useFonts({ Roboto_100Thin, Roboto_100Thin_Italic, Roboto_300Light, Roboto_300Light_Italic, Roboto_400Regular, Roboto_400Regular_Italic, Roboto_500Medium, Roboto_500Medium_Italic, Roboto_700Bold, Roboto_700Bold_Italic, Roboto_900Black, Roboto_900Black_Italic })

  useEffect(() => {
    if (error)
      console.error(error);
    if (loaded || error)
      SplashScreen.hideAsync();
  }, [loaded, error])

  if (!loaded)
    return <Loading />;
  
  return <Redirect href='/auth' />;
}
