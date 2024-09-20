import React, { Children, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import NetInfo from "@react-native-community/netinfo";
import _ from "lodash";

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Background fetch task name
const BACKGROUND_FETCH_TASK = "background-fetch-task";

// Define background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const { isConnected } = await NetInfo.fetch();

  if (isConnected) {
    try {
      const data = await AsyncStorage.getItem("@carformdata");
      if (data) {
        const parsedData = JSON.parse(data);
        const inspectedItems = parsedData.filter(
          (item) => item.status === "inspected"
        );

        if (inspectedItems.length > 0) {
          await triggerManualUpload(inspectedItems);
        }
      }
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.log("Error during background fetch task:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  } else {
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }
});

// Register background fetch task
const registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false, // Continue running when app is closed
    startOnBoot: true, // Start task when device is rebooted
  });
};

// Unregister background task (optional)
const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};

// Trigger the manual upload of data
const triggerManualUpload = _.debounce(async (itemsToUpload) => {
  try {
    for (let item of itemsToUpload) {
      const groupedData = await getGroupedData(item);
      await postData(item, groupedData);
    }
  } catch (error) {
    console.log("Error triggering manual upload:", error);
  }
}, 1000);

// Group questions data
const getGroupedData = async (obj) => {
  const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");
  const carbodyjsonValue = await AsyncStorage.getItem("@carBodyQuestionsdata");
  const questionsData = questionjsonValue ? JSON.parse(questionjsonValue) : [];
  const carbodyData = carbodyjsonValue ? JSON.parse(carbodyjsonValue) : [];

  const ques = questionsData.filter((item) => item.QtempID == obj.tempID);
  const carbodyques = carbodyData.filter((item) => item.tempID == obj.tempID);

  const groupedData = ques.reduce((acc, item) => {
    const {
      catName,
      subCatName,
      IndID,
      IndQuestion,
      value,
      point,
      reason,
      image,
    } = item;

    let category = acc.find((cat) => cat.mainCat == catName);

    if (!category) {
      category = { mainCat: catName, mainCatData: [] };
      acc.push(category);
    }

    let subCategory = category.mainCatData.find(
      (subCat) => subCat.subCatName == subCatName
    );

    if (!subCategory) {
      subCategory = { subCatName: subCatName, subCatData: [] };
      category.mainCatData.push(subCategory);
    }

    const dataItem = { IndID, IndQuestion, value, point, reason, image };
    subCategory.subCatData.push(dataItem);

    return acc;
  }, []);

  return { groupedData, carbodyques };
};

// Post data to the server
const postData = async (obj, { groupedData, carbodyques }) => {
  const formData = new FormData();

  formData.append("dealershipId", obj.dealershipId);
  formData.append("duserId", obj.duserId);
  formData.append("customerID", obj.customerID);
  formData.append("registrationNo", obj.registrationNo);
  formData.append("chasisNo", obj.chasisNo);
  formData.append("EngineNo", obj.EngineNo);
  formData.append("inspectionDate", obj.inspectionDate);
  formData.append("mfgId", obj.mfgId);
  formData.append("carId", obj.carId);
  formData.append("varientId", obj.varientId);
  formData.append("model", obj.model);
  formData.append("engineDisplacement", obj.engineDisplacement);
  formData.append("cplc", obj.cplc);
  formData.append("buyingCode", obj.buyingCode);
  formData.append("NoOfOwners", obj.NoOfOwners);
  formData.append("transmissionType", obj.transmissionType);
  formData.append("mileage", obj.mileage);
  formData.append("registrationCity", obj.registrationCity);
  formData.append("FuelType", obj.FuelType);
  formData.append("color", obj.color);
  formData.append("status", obj.status);

  groupedData.forEach((category, catIndex) => {
    formData.append(`data[${catIndex}][mainCat]`, category.mainCat);

    category.mainCatData.forEach((subCategory, subCatIndex) => {
      formData.append(
        `data[${catIndex}][mainCatData][${subCatIndex}][subCatName]`,
        subCategory.subCatName
      );

      subCategory.subCatData.forEach((item, itemIndex) => {
        const baseIndex = `data[${catIndex}][mainCatData][${subCatIndex}][subCatData][${itemIndex}]`;

        formData.append(`${baseIndex}[IndQuestion]`, item.IndQuestion);
        formData.append(`${baseIndex}[value]`, item.value);
        if (item.point) formData.append(`${baseIndex}[point]`, item.point);
        if (item.reason) formData.append(`${baseIndex}[reason]`, item.reason);
        if (item.image && item.image.uri) {
          const file = {
            uri: item.image.uri,
            type: item.image.type,
            name: item.image.name,
          };
          formData.append(`${baseIndex}[image]`, file);
        }
      });
    });
  });

  carbodyques.forEach((problemItem, problemIndex) => {
    formData.append(
      `problems[${problemIndex}][problemLocation]`,
      problemItem.problemLocation
    );
    problemItem.problems.forEach((problem, index) => {
      formData.append(
        `problems[${problemIndex}][problems][${index}][problemName]`,
        problem.problemName
      );
      formData.append(
        `problems[${problemIndex}][problems][${index}][selectedValue]`,
        problem.selectedValue
      );
    });
    if (problemItem.image && problemItem.image.uri) {
      const file = {
        uri: problemItem.image.uri,
        name: problemItem.image.name,
        type: problemItem.image.type,
      };
      formData.append(`problems[${problemIndex}][image]`, file);
    }
  });

  try {
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await axios.post(
      "auth/add_carinspectionsnew.php",
      formData,
      { headers }
    );

    if (response.data.success) {
      await removeProcessedData(obj.tempID);
      const expoPushToken = await registerForPushNotificationsAsync();
      if (expoPushToken) {
        sendPushNotification(
          expoPushToken,
          "Car Uploaded Successfully",
          `Car With Registration No ${response.data.registration_no} Uploaded.`
        );
      }
    } else {
      const expoPushToken = await registerForPushNotificationsAsync();
      if (expoPushToken) {
        sendPushNotification(
          expoPushToken,
          "Car Upload Failed",
          response.data.message
        );
      }
    }
  } catch (error) {
    console.log("Error posting data:", error);
  }
};

// Remove processed data from AsyncStorage
const removeProcessedData = async (processedTempID) => {
  try {
    const carjsonValue = await AsyncStorage.getItem("@carformdata");
    if (carjsonValue) {
      let carFormData = JSON.parse(carjsonValue);
      carFormData = carFormData.filter((obj) => obj.tempID !== processedTempID);

      // Update AsyncStorage with the remaining unprocessed data
      await AsyncStorage.setItem("@carformdata", JSON.stringify(carFormData));

      console.log("Processed data removed successfully.");
    } else {
      console.log("No data found in AsyncStorage for @carformdata.");
    }
  } catch (error) {
    console.log("Error removing processed data:", error);
  }
};

// Send push notification
const sendPushNotification = _.debounce(
  async (expoPushToken, title, message) => {
    const messageToSend = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: message,
      data: { message },
    };

    await axios.post("https://exp.host/--/api/v2/push/send", messageToSend);
  },
  100
);

// Register for push notifications
const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

// Main app entry
const DataPostProvider = ({ children }) => {
  useEffect(() => {
    const initializeBackgroundTask = async () => {
      const status = await BackgroundFetch.getStatusAsync();
      if (
        status !== BackgroundFetch.Status.Restricted &&
        status !== BackgroundFetch.Status.Denied
      ) {
        await registerBackgroundFetchAsync();
      } else {
        console.log("Background fetch is disabled or restricted.");
      }
    };

    initializeBackgroundTask();

    // Cleanup function (unregister task if needed)
    return () => {
      unregisterBackgroundFetchAsync();
    };
  }, []);

  return <>{children}</>; // No UI needed for this task, so return null.
};

export default DataPostProvider;
