import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";

import BottomTabNavigation from "./BottonTabNavigation";
import AuthNavigator from "./AuthNavigator";
import { AuthContext } from "../context/authContext";
import SingleCarInfo from "../screens/singleCarInfo/SingleCarInfo";
import DraftSingleCar from "../screens/draftSingleCar/DraftSingleCar";
import SingleInspection from "../screens/inspectionBoard/SingleInspection";
import InspectionBoard from "../screens/inspectionBoard/InspectionBoard";

const Stack = createStackNavigator();
const FeedNavigation = () => {
  const [userData] = useContext(AuthContext);

  const authenticatedUser = userData?.token;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "card" }}
    >
      {authenticatedUser ? (
        <>
          <Stack.Screen name="Home" component={BottomTabNavigation} />

          <Stack.Screen name="SingleCar" component={SingleCarInfo} />
          <Stack.Screen name="DraftSingleCar" component={DraftSingleCar} />
          <Stack.Screen name="InspectionBoard" component={InspectionBoard} />
          <Stack.Screen name="SingleInspection" component={SingleInspection} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default FeedNavigation;
