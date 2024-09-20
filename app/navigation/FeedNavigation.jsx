import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import BottomTabNavigation from "./BottonTabNavigation";
import AuthNavigator from "./AuthNavigator";
import { AuthContext } from "../context/authContext";
import SingleCarInfo from "../screens/singleCarInfo/SingleCarInfo";
import DraftSingleCar from "../screens/draftSingleCar/DraftSingleCar";
import SingleInspection from "../screens/inspectionBoard/SingleInspection";
import InspectionBoard from "../screens/inspectionBoard/InspectionBoard";
import SettingsNavigation from "./SettingsNavigation";
import UploadingProgress from "../screens/settingsPages/UploadingProcess";
import Customerform from "../screens/carSelling/Customerform";
import ViewReport from "../screens/updateCarData/ViewReport";
import EditCarInfo from "../screens/updateCarData/EditCarInfo";
import EditProblems from "../screens/updateCarData/EditProblems";
import EditIndicatorsRating from "../screens/updateCarData/EditIndicatorsRating";
import CustomersProfile from "../screens/settingsPages/CustomersProfile"; // Assume these are all imported from one file

const FeedNavigation = () => {
  const authContext = useContext(AuthContext);

  const Stack = createStackNavigator();

  if (!authContext) {
    console.log("AuthContext is not available");
    return null;
  }

  const [userData] = authContext;
  const authenticatedUser = userData?.token !== "";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authenticatedUser ? (
        <>
          <Stack.Screen name="Home" component={BottomTabNavigation} />
          <Stack.Screen name="SingleCar" component={SingleCarInfo} />
          <Stack.Screen name="DraftSingleCar" component={DraftSingleCar} />
          <Stack.Screen name="InspectionBoard" component={InspectionBoard} />
          <Stack.Screen name="SingleInspection" component={SingleInspection} />
          <Stack.Screen name="SettingsPage" component={SettingsNavigation} />
          <Stack.Screen name="UploadProgress" component={UploadingProgress} />
          <Stack.Screen name="CustomersProfile" component={CustomersProfile} />
          <Stack.Screen name="CustomerForm" component={Customerform} />
          <Stack.Screen name="ViewReport" component={ViewReport} />
          <Stack.Screen name="EditCarInfo" component={EditCarInfo} />
          <Stack.Screen name="EditProblems" component={EditProblems} />
          <Stack.Screen
            name="EditIndicatorsRating"
            component={EditIndicatorsRating}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default FeedNavigation;
