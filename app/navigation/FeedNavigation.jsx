import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import BottomTabNavigation from "./BottonTabNavigation";
import AuthNavigator from "./AuthNavigator";
import { AuthContext } from "../context/authContext";
import SingleCarInfo from "../screens/singleCarInfo/SingleCarInfo";
import DraftSingleCar from "../screens/draftSingleCar/DraftSingleCar";
import SingleInspection from "../screens/inspectionBoard/SingleInspection";
import InspectionBoard from "../screens/inspectionBoard/InspectionBoard";
import NetInfo from "@react-native-community/netinfo";
import { DataPostContext } from "../context/dataPostContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { triggerManualUpload } = useContext(DataPostContext);
  const [isConnected, setIsConnected] = useState(false);
  const [questionsInLocal, setQuestionsInLocal] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const Stack = createStackNavigator();

  // Monitor internet connectivity changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Fetch car data from AsyncStorage periodically
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const data = await AsyncStorage.getItem("@carformdata");
        setQuestionsInLocal(data);
      } catch (error) {
        console.log("Error fetching car data from AsyncStorage:", error);
      }
    };

    // Initial fetch
    fetchCarData();

    // Optional: Debounce or throttle this interval to avoid multiple uploads
    const intervalId = setInterval(fetchCarData, 300000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Trigger upload when internet is connected and data is available
  useEffect(() => {
    if (isConnected && questionsInLocal && !isUploading) {
      console.log("Starting upload...");
      setIsUploading(true); // Mark as uploading
      triggerManualUpload(); // Since this is debounced, no need for .then()
      console.log("Upload triggered");

      // Optionally add a delay to simulate waiting for upload to finish
      setTimeout(() => {
        console.log("Upload finished");
        setIsUploading(false); // Mark as upload finished
      }, 300000); // You can adjust the delay based on how long uploads take
    }
  }, [isConnected, questionsInLocal, isUploading]);

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
