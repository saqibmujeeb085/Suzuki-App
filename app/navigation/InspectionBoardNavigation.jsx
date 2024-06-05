import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import InspectionBoard from "../screens/inspectionBoard/InspectionBoard";
import SingleInspection from "../screens/inspectionBoard/SingleInspection";
import SigngleCarPages from "./SingleCarPages";

const Stack = createStackNavigator();
const InspectionBoardNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InspectionBoard" component={InspectionBoard} />
      <Stack.Screen name="SingleInspection" component={SingleInspection} />
    </Stack.Navigator>
  );
};

export default InspectionBoardNavigation;
