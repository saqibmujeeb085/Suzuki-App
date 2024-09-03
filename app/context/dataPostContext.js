import React, { createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications"; // Import Expo Notifications
import * as Device from "expo-device"; // Import Expo Device
import { Platform } from "react-native"; // Import Platform from react-native

// Set notification handler to show alerts when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DataPostContext = createContext();

const DataPostProvider = ({ children }) => {
  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is in the foreground
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
      });

    // Clean up the subscription when the component unmounts
    return () => {
      foregroundSubscription.remove();
    };
  }, []);

  // Function to register for push notifications and get the Expo push token
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
      console.log(token);
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

  // Call this function to send a notification
  const sendPushNotification = async (expoPushToken, title, message) => {
    const messageToSend = {
      to: expoPushToken,
      sound: "default",
      title: title, // Set the title based on the function argument
      body: message, // Set the body based on the function argument
      data: { message },
    };

    await axios.post("https://exp.host/--/api/v2/push/send", messageToSend);
  };

  // Function to remove processed data from AsyncStorage
  const removeProcessedData = async (processedTempID) => {
    try {
      const carjsonValue = await AsyncStorage.getItem("@carformdata");
      const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");

      if (carjsonValue && questionjsonValue) {
        let carFormData = JSON.parse(carjsonValue);
        let questionsData = JSON.parse(questionjsonValue);

        if (!Array.isArray(carFormData)) {
          carFormData = [];
        }
        if (!Array.isArray(questionsData)) {
          questionsData = [];
        }

        carFormData = carFormData.filter(
          (obj) => obj.tempID !== processedTempID
        );
        questionsData = questionsData.filter(
          (q) => q.QtempID !== processedTempID
        );

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
      console.error("Error removing processed data:", error);
    }
  };

  // Function to process and upload data
  const processDataUpload = async () => {
    try {
      const carjsonValue = await AsyncStorage.getItem("@carformdata");
      const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");
      const carbodyjsonValue = await AsyncStorage.getItem(
        "@carBodyQuestionsdata"
      );

      if (carjsonValue && questionjsonValue) {
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

            console.log(carbodyques);

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
          console.error("Data retrieved from AsyncStorage is not an array.");
        }
      } else {
        console.log(
          "No data found in AsyncStorage for @carformdata or @carQuestionsdata."
        );
      }
    } catch (error) {
      console.error("Error processing data upload:", error);
    }
  };

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
        console.log(
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
        "auth/get_carinspectionsnew.php", // Use your server URL
        formData,
        {
          headers: headers,
        }
      );

      if (response.data.success) {
        console.log(response.data);

        // Fetch the Expo Push Token and send a notification
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          // Send notification with response success and message
          sendPushNotification(
            expoPushToken,
            "Data Upload Success",
            response.data.message
          );
        }
      } else {
        // Fetch the Expo Push Token and send an error notification
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          sendPushNotification(
            expoPushToken,
            "Data Upload Failed",
            response.data.message
          );
        }
        console.error("Server responded with an error:", response.data.message);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // Function to trigger manual upload
  const triggerManualUpload = async () => {
    await processDataUpload();
  };

  return (
    <DataPostContext.Provider value={{ triggerManualUpload }}>
      {children}
    </DataPostContext.Provider>
  );
};

export { DataPostContext, DataPostProvider };
