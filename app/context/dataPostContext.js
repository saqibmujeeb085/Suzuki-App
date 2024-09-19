import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications"; // Import Expo Notifications
import * as Device from "expo-device"; // Import Expo Device
import { Platform } from "react-native"; // Import Platform from react-native
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import NetInfo from "@react-native-community/netinfo";
import _ from "lodash"; // Import lodash for debounce

// Set notification handler to show alerts when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Define the background fetch task name
const BACKGROUND_FETCH_TASK = "background-fetch-task";

// Create context
const DataPostContext = createContext();

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const { isConnected } = await NetInfo.fetch();

  if (isConnected) {
    try {
      // Call your data upload function when internet is connected
      const data = await AsyncStorage.getItem("@carformdata");
      if (data) {
        await triggerManualUpload(); // Ensure this function only triggers once
      }
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.log("Error during background fetch task", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  } else {
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }
});

// Register background fetch task
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false, // Continue running when app is closed
    startOnBoot: true, // Start task when device is rebooted
  });
}

// Unregister background task (optional)
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

const DataPostProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [questionsInLocal, setQuestionsInLocal] = useState(null);

  // Register background fetch task
  useEffect(() => {
    const registerFetchTask = async () => {
      const isRegistered = await BackgroundFetch.getStatusAsync();
      if (!isRegistered) {
        await registerBackgroundFetchAsync();
      }
    };

    registerFetchTask();

    return () => {
      unregisterBackgroundFetchAsync(); // Optional cleanup
    };
  }, []);

  // Monitor internet connectivity changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription on component unmount
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

    // Set up interval to periodically check for updates in AsyncStorage
    const intervalId = setInterval(fetchCarData, 300000); // Check every 5 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Trigger upload when internet is connected and data is available
  useEffect(() => {
    if (isConnected && questionsInLocal) {
      triggerManualUpload();
    }
  }, [isConnected, questionsInLocal]);

  const removeProcessedData = async (processedTempID) => {
    try {
      // Retrieve stored data from AsyncStorage
      const carjsonValue = await AsyncStorage.getItem("@carformdata");
      const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");

      if (carjsonValue && questionjsonValue) {
        let carFormData = JSON.parse(carjsonValue);
        let questionsData = JSON.parse(questionjsonValue);

        // Ensure the data is an array
        if (!Array.isArray(carFormData)) {
          carFormData = [];
        }
        if (!Array.isArray(questionsData)) {
          questionsData = [];
        }

        // Filter out the processed data
        carFormData = carFormData.filter(
          (obj) => obj.tempID !== processedTempID
        );
        questionsData = questionsData.filter(
          (q) => q.QtempID !== processedTempID
        );

        // Update AsyncStorage with the new data
        await AsyncStorage.setItem("@carformdata", JSON.stringify(carFormData));
        await AsyncStorage.setItem(
          "@carQuestionsdata",
          JSON.stringify(questionsData)
        );

        console.log("Processed data removed successfully.");
      } else {
        console.log(
          "No data found in AsyncStorage for @carformdata or @carQuestionsdata."
        );
      }
    } catch (error) {
      console.log("Error removing processed data:", error);
    }
  };

  const triggerManualUpload = _.debounce(async () => {
    try {
      const carjsonValue = await AsyncStorage.getItem("@carformdata");
      const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");
      const carbodyjsonValue = await AsyncStorage.getItem(
        "@carBodyQuestionsdata"
      );

      if (carjsonValue && questionjsonValue && carbodyjsonValue) {
        const carFormData = JSON.parse(carjsonValue);
        const questionsData = JSON.parse(questionjsonValue);
        const carbodyData = carbodyjsonValue
          ? JSON.parse(carbodyjsonValue)
          : [];

        if (Array.isArray(carFormData) && Array.isArray(questionsData)) {
          carFormData.forEach((obj) => {
            const ques = questionsData.filter(
              (item) => item.QtempID == obj.tempID
            );
            const carbodyques = carbodyData.filter(
              (item) => item.tempID == obj.tempID
            );

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
                category = {
                  mainCat: catName,
                  mainCatData: [],
                };
                acc.push(category);
              }

              let subCategory = category.mainCatData.find(
                (subCat) => subCat.subCatName == subCatName
              );

              if (!subCategory) {
                subCategory = {
                  subCatName: subCatName,
                  subCatData: [],
                };
                category.mainCatData.push(subCategory);
              }

              const dataItem = {
                IndID: IndID,
                IndQuestion: IndQuestion,
                value: value,
                point: point,
                reason: reason,
                image: image,
              };

              subCategory.subCatData.push(dataItem);

              return acc;
            }, []);

            if (obj.status === "inspected") {
              postData(obj, groupedData, carbodyques);
            }
          });
        } else {
          console.log("Data retrieved from AsyncStorage is not an array.");
        }
      } else {
        console.log(
          "No data found in AsyncStorage for @carformdata or @carQuestionsdata."
        );
      }
    } catch (error) {
      console.log("Error processing data upload:", error);
    }
  }, 1000); // Debounce to avoid multiple executions

  const postData = async (obj, groupedData, carbodyques) => {
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

    if (obj.images && Array.isArray(obj.images)) {
      for (const image of obj.images) {
        if (image.uri) {
          const file = {
            uri: image.uri,
            type: image.type,
            name: image.name,
          };
          formData.append("images[]", file);
        }
      }
    }

    if (obj.documents && Array.isArray(obj.documents)) {
      for (const doc of obj.documents) {
        if (doc.uri) {
          const file = {
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
          };
          formData.append("documents[]", file);
        }
      }
    }

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

          if (item.point) {
            formData.append(`${baseIndex}[point]`, item.point);
          }

          if (item.reason) {
            formData.append(`${baseIndex}[reason]`, item.reason);
          }

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
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.post(
        "auth/add_carinspectionsnew.php", // Use your server URL
        formData,
        {
          headers: headers,
        }
      );

      if (response.data.success) {
        removeProcessedData(obj.tempID);
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          sendPushNotification(
            expoPushToken,
            "Car Uploaded Successfully",
            `car With Registration No ${response.data.registration_no} Uploaded.`
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

  return (
    <DataPostContext.Provider value={{ triggerManualUpload }}>
      {children}
    </DataPostContext.Provider>
  );
};

export { DataPostContext, DataPostProvider };
