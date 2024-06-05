import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import SingleCarInfo from "../screens/singleCarInfo/SingleCarInfo";
import DraftSingleCar from "../screens/draftSingleCar/DraftSingleCar";

const Stack = createStackNavigator();
const SigngleCarPages = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SingleCar" component={SingleCarInfo} />
      <Stack.Screen name="DraftSingleCar" component={DraftSingleCar} />
    </Stack.Navigator>
  );
};

export default SigngleCarPages;
