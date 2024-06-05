import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import CustomerDetails from "../screens/addNewInspection/CustomerDetails";
import CarDetails from "../screens/addNewInspection/CarDetails";
import CarBodyDetails from "../screens/addNewInspection/CarBodyDetails";
import CarFiles from "../screens/addNewInspection/CarFiles";

const Stack = createStackNavigator();

const NewInspectionNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "transparentModal" }}
    >
      {/* <Stack.Screen name="CustomerDetails" component={CustomerDetails} /> */}
      <Stack.Screen name="CarDetails" component={CarDetails} />
      <Stack.Screen name="CarBodyDetails" component={CarBodyDetails} />
      <Stack.Screen name="CarFiles" component={CarFiles} />
    </Stack.Navigator>
  );
};

export default NewInspectionNavigation;
