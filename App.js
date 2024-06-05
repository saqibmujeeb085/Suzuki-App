import React, { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import FeedNavigation from "./app/navigation/FeedNavigation";
import { useFonts } from "expo-font";
import { AuthProvider } from "./app/context/authContext";
import * as SplashScreen from "expo-splash-screen";
import { InspecteCarProvider } from "./app/context/newInspectionContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    suzukiRegular: require("./app/assets/fonts/Suzuki-Regular.ttf"),
    suzukiBold: require("./app/assets/fonts/Suzuki-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing until the fonts are loaded
  }

  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      <AuthProvider>
        <InspecteCarProvider>
          <FeedNavigation />
        </InspecteCarProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
