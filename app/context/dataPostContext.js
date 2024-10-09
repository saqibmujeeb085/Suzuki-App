import React, { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import axios from "axios";
import * as Notifications from "expo-notifications";

const DataPostContext = createContext();

// Task name for Background Fetch
const BACKGROUND_FETCH_TASK = "background-fetch-task";

// Flag to track whether a post is already being processed
let isPosting = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Function to post data
const postData = async () => {
  if (isPosting) {
    // Prevent duplicate posts if another post is already happening
    console.log("Post in progress, skipping...");
    return;
  }

  try {
    isPosting = true; // Set flag to prevent duplicates

    // Fetch network info
    const netInfo = await NetInfo.fetch();

    // Fetch stored data from AsyncStorage
    const storedData = await AsyncStorage.getItem("@carformdata");

    if (storedData) {
      // Parse the stored data
      const parsedData = JSON.parse(storedData);

      if (Array.isArray(parsedData)) {
        // Check if any data has status "inspected"
        const hasInspected = parsedData.some(
          (item) => item.status === "inspected"
        );

        // Check both conditions: data with 'inspected' status and network connectivity
        if (hasInspected && netInfo.isConnected) {
          console.log(
            "Connected to the internet and found data with status 'inspected'. Proceeding with post..."
          );
          getAllData();
        } else if (!hasInspected) {
          console.log("No data with status 'inspected'. Skipping post...");
        } else if (!netInfo.isConnected) {
          console.log("No internet connection. Skipping post...");
        }
      } else {
        console.log("Stored data is not an array.");
      }
    } else {
      console.log("No stored data found.");
    }
  } catch (error) {
    console.error("Error posting data:", error);
  } finally {
    isPosting = false; // Reset flag after post is done
  }
};

// Request notification permissions for local notifications
async function registerForLocalNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission for notifications not granted");
    return;
  }

  console.log("Local Notifications Permission granted");
}

// Function to schedule a local notification
const scheduleLocalNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Car Upload Notification",
      body: "Car inspection data uploaded successfully!",
    },
    trigger: {
      seconds: 1, // triggers after 1 second
    },
  });
};

// Call this instead of sending a push notification
const notifyCarUploadSuccess = () => {
  scheduleLocalNotification();
};

const getAllData = async () => {
  try {
    const carjsonValue = await AsyncStorage.getItem("@carformdata");
    const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");
    const carbodyjsonValue = await AsyncStorage.getItem(
      "@carBodyQuestionsdata"
    );

    if (carjsonValue && questionjsonValue && carbodyjsonValue) {
      const carFormData = JSON.parse(carjsonValue);
      const questionsData = JSON.parse(questionjsonValue);
      const carbodyData = carbodyjsonValue ? JSON.parse(carbodyjsonValue) : [];

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
            startPosting(obj, groupedData, carbodyques);
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
};

const startPosting = async (obj, groupedData, carbodyques) => {
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
    // Append problemLocation and tempID
    formData.append(
      `problems[${problemIndex}][problemLocation]`,
      problemItem.problemLocation
    );
    formData.append(`problems[${problemIndex}][tempID]`, problemItem.tempID);

    // Append problems array (problemName, selectedValue, and image)
    problemItem.problems.forEach((problem, index) => {
      // Append the problemName and selectedValue for each problem
      formData.append(
        `problems[${problemIndex}][problems][${index}][problemName]`,
        problem.problemName
      );
      formData.append(
        `problems[${problemIndex}][problems][${index}][selectedValue]`,
        problem.selectedValue
      );

      // Append the image within each problem object
      if (problem.image && problem.image.uri) {
        const file = {
          uri: problem.image.uri,
          name: problem.image.name,
          type: problem.image.type,
        };
        formData.append(
          `problems[${problemIndex}][problems][${index}][image]`,
          file
        );
      }
    });
  });

  try {
    console.log(formData);
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(
      "/auth/add_carinspectionsnew.php",
      formData,
      {
        headers: headers,
      }
    );

    if (response.data.success == 200) {
      removeProcessedData(obj.tempID);
      notifyCarUploadSuccess(); // Local notification for successful upload
    } else {
      const expoPushToken = await registerForLocalNotificationsAsync();
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
    const expoPushToken = await registerForLocalNotificationsAsync();
    if (expoPushToken) {
      // Send error notification
      sendPushNotification(
        expoPushToken,
        "Car Upload Failed",
        "There was an error posting the data."
      );
    }
  }
};

const removeProcessedData = async (processedTempID) => {
  try {
    // Retrieve stored data from AsyncStorage
    const carjsonValue = await AsyncStorage.getItem("@carformdata");
    const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");
    // const carbodyjsonValue = await AsyncStorage.getItem(
    //   "@carBodyQuestionsdata"
    // ); // Retrieve car body questions

    if (carjsonValue && questionjsonValue && carbodyjsonValue) {
      let carFormData = JSON.parse(carjsonValue);
      let questionsData = JSON.parse(questionjsonValue);
      // let carBodyData = JSON.parse(carbodyjsonValue); // Parse car body data

      // Ensure the data is an array
      if (!Array.isArray(carFormData)) {
        carFormData = [];
      }
      if (!Array.isArray(questionsData)) {
        questionsData = [];
      }
      // if (!Array.isArray(carBodyData)) {
      //   carBodyData = [];
      // }

      // Log the data before filtering
      console.log("Before filtering:", {
        carFormData,
        questionsData,
        carBodyData,
        processedTempID,
      });

      // Filter out the processed data for each data set
      carFormData = carFormData.filter((obj) => obj.tempID !== processedTempID);
      questionsData = questionsData.filter(
        (q) => q.QtempID !== processedTempID
      );
      // carBodyData = carBodyData.filter(
      //   (item) => item.tempID !== processedTempID
      // ); // Filter car body data

      // Log the data after filtering to verify
      console.log("After filtering:", {
        carFormData,
        questionsData,
        carBodyData,
      });

      // Update AsyncStorage with the new data
      await AsyncStorage.setItem("@carformdata", JSON.stringify(carFormData));
      await AsyncStorage.setItem(
        "@carQuestionsdata",
        JSON.stringify(questionsData)
      );
      // await AsyncStorage.setItem(
      //   "@carBodyQuestionsdata",
      //   JSON.stringify(carBodyData)
      // ); // Update car body questions data

      console.log("Processed data removed successfully.");
    } else {
      console.log(
        "No data found in AsyncStorage for @carformdata, @carQuestionsdata, or @carBodyQuestionsdata."
      );
    }
  } catch (error) {
    console.log("Error removing processed data:", error);
  }
};

const sendPushNotification = async (expoPushToken, title, message) => {
  const messageToSend = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: message,
    data: { message },
  };

  try {
    await axios.post("https://exp.host/--/api/v2/push/send", messageToSend);
    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

// Define the Background Fetch task that runs continuously
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log(`Background fetch executed at: ${new Date(now).toISOString()}`);

  // Post data in background fetch task
  await postData();

  // Return the successful result type to indicate task completion
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// Register the Background Fetch task
async function registerBackgroundFetchAsync() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 5,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("Background fetch task registered.");
  } catch (error) {
    console.error("Error registering background fetch task:", error);
  }
}

// Context Provider component
export const DataPostProvider = ({ children }) => {
  useEffect(() => {
    // Register background task for continuous operation
    registerBackgroundFetchAsync();

    // Check data and post every 30 seconds while the app is in the foreground
    const intervalId = setInterval(postData, 30000);

    return () => {
      clearInterval(intervalId); // Cleanup interval when component unmounts
    };
  }, []);

  return (
    <DataPostContext.Provider value={{}}>{children}</DataPostContext.Provider>
  );
};

export default DataPostContext;
