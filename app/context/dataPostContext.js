import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuesAndAnsContext } from "./questionAndCategories";
import axios from "axios";

const DataPostContext = createContext();

const DataPostProvider = ({ children }) => {
  const [categories] = useContext(QuesAndAnsContext);

  const removeProcessedData = async (processedTempID) => {
    try {
      // Retrieve the stored data from AsyncStorage
      const carjsonValue = await AsyncStorage.getItem("@carformdata");
      const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");

      if (carjsonValue && questionjsonValue) {
        // Parse the JSON string into a JavaScript object
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
      console.error("Error removing processed data:", error);
    }
  };

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

        // console.log(carbodyData);
        // console.log(questionsData);

        // Ensure the data is an array
        if (Array.isArray(carFormData) && Array.isArray(carbodyData)) {
          carFormData.forEach((obj) => {
            const ques = questionsData.filter(
              (item) => item.QtempID == obj.tempID
            );

            const carbodyques = carbodyData.filter(
              (item) => item.QtempID == obj.tempID
            );

            const categoryIds = categories.map((category) => category.id);
            const allCategoriesPresent = categoryIds.every((categoryId) =>
              ques.some((q) => q.catID === categoryId)
            );

            if (allCategoriesPresent && obj.status === "inspected") {
              postData(obj, ques, carbodyques);
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

  const postData = async (obj, ques, carbodyques) => {
    console.log("uploading temp ID", obj.tempID);

    const formData = new FormData();

    // Append text fields
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

    // Append images and documents
    obj.images.forEach((image, index) => {
      formData.append(`images[${index}]`, {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
    });

    obj.documents.forEach((doc, index) => {
      formData.append(`documents[${index}]`, {
        uri: doc.uri,
        name: doc.name,
        type: doc.type,
      });
    });

    // Append ques data
    ques.forEach((item, index) => {
      formData.append(`data[${index}][catID]`, item.catID);
      formData.append(`data[${index}][IndID]`, item.IndID);
      formData.append(`data[${index}][IndQuestion]`, item.IndQuestion);
      formData.append(`data[${index}][value]`, item.value);
      if (item.point) {
        formData.append(`data[${index}][point]`, item.point);
      }
      if (item.reason) {
        formData.append(`data[${index}][reason]`, item.reason);
      }
      if (item.image && item.image.uri) {
        formData.append(`inspectionImages[${index}]`, {
          uri: item.image.uri,
          name: item.image.name,
          type: item.image.type,
        });
      }
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
        formData.append(`problems[${problemIndex}][image]`, {
          uri: problemItem.image.uri,
          name: problemItem.image.name,
          type: problemItem.image.type,
        });
      }
    });

    console.log("form all data", formData);

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const response = await axios.post(
        "/auth/add_carandquestionscombine.php",
        formData,
        {
          headers: headers,
        }
      );

      console.log("done to post data");
      console.log("Response:", response.data.message);

      if (response.data.code == 200) {
        removeProcessedData(obj.tempID);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
