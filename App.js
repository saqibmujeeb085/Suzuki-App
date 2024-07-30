import React, { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import FeedNavigation from "./app/navigation/FeedNavigation";
import { useFonts } from "expo-font";
import { AuthProvider } from "./app/context/authContext";
import * as SplashScreen from "expo-splash-screen";
import { InspecteCarProvider } from "./app/context/newInspectionContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts as useGoogleFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { LoginDataProvider } from "./app/context/loginDataContext";
import { FormDataProvider } from "./app/context/formDataContext";
import { QuesAndAnsProvider } from "./app/context/questionAndCategories";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    suzukiRegular: require("./app/assets/fonts/Suzuki-Regular.ttf"),
    suzukiBold: require("./app/assets/fonts/Suzuki-Bold.ttf"),
    poppins_regular: Poppins_400Regular,
    poppins_medium: Poppins_500Medium,
    poppins_semiBold: Poppins_600SemiBold,
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
    <AuthProvider>
      <LoginDataProvider>
        <FormDataProvider>
          <QuesAndAnsProvider>
          <NavigationContainer onLayout={onLayoutRootView}>
            <SafeAreaProvider>
              <InspecteCarProvider>
                <FeedNavigation />
              </InspecteCarProvider>
            </SafeAreaProvider>
          </NavigationContainer>
          </QuesAndAnsProvider>
        </FormDataProvider>
      </LoginDataProvider>
    </AuthProvider>
  );
}
