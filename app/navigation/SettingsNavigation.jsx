import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Animated } from "react-native";
import UploadingProgress from "../screens/settingsPages/UploadingProcess";

const Stack = createStackNavigator();

const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [screen.width, 0, -screen.width],
  });

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(progress, inverted),
        },
      ],
    },
  };
};

const SettingsNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        cardStyleInterpolator: forSlide,
      }}
    >
      <Stack.Screen name="UploadProgress" component={UploadingProgress} />
    </Stack.Navigator>
  );
};

export default SettingsNavigation;
