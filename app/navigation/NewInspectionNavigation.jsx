import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Animated } from "react-native";
import CarDetails from "../screens/addNewInspection/CarDetails";
import CarBodyDetails from "../screens/addNewInspection/CarBodyDetails";
import CarFiles from "../screens/addNewInspection/CarFiles";

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

const NewInspectionNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        cardStyleInterpolator: forSlide,
      }}
    >
      <Stack.Screen name="CarDetails" component={CarDetails} />
      <Stack.Screen name="CarBodyDetails" component={CarBodyDetails} />
      <Stack.Screen name="CarFiles" component={CarFiles} />
    </Stack.Navigator>
  );
};

export default NewInspectionNavigation;
