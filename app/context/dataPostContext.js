import React, { createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuesAndAnsContext } from "./questionAndCategories";
import axios from "axios";

const DataPostContext = createContext();

const DataPostProvider = ({ children }) => {
  const [categories] = useContext(QuesAndAnsContext);

  // Function to remove processed data from AsyncStorage
  const removeProcessedData = async (processedTempID) => {
    try {
      // Retrieve stored data from AsyncStorage
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

        // Ensure the data is an array
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
                value,
                point,
                reason,
                image,
              } = item;

              let category = acc.find((cat) => cat.mainCat === catName);

              if (!category) {
                category = {
                  mainCat: catName,
                  mainCatData: [],
                };
                acc.push(category);
              }

              let subCategory = category.mainCatData.find(
                (subCat) => subCat.subCatName === subCatName
              );

              if (!subCategory) {
                subCategory = {
                  subCatName: subCatName,
                  subCatData: [],
                };
                category.mainCatData.push(subCategory);
              }

              subCategory.subCatData.push({
                IndQuestion: `Question${IndID}`,
                value: value,
                point: point,
                reason: reason,
                image: image ? { name: image.name, type: image.type } : {},
              });

              return acc;
            }, []);

            const categoryIds = categories.map((category) => category.id);
            const allCategoriesPresent = categoryIds.every((categoryId) =>
              ques.some((q) => q.catID === categoryId)
            );

            if (allCategoriesPresent && obj.status === "inspected") {
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

  // Function to post data to the server
  const postData = async (obj, groupedData, carbodyques) => {
    console.log("Uploading temp ID:", obj.tempID);

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
    groupedData.forEach((category, catIndex) => {
      category.mainCatData.forEach((subCategory, subCatIndex) => {
        subCategory.subCatData.forEach((item, itemIndex) => {
          const baseIndex = `data[${catIndex}].mainCatData[${subCatIndex}].subCatData[${itemIndex}]`;

          formData.append(`data[${catIndex}].mainCat`, category.mainCat);
          formData.append(
            `data[${catIndex}].mainCatData[${subCatIndex}].subCatName`,
            subCategory.subCatName
          );
          formData.append(`${baseIndex}[IndQuestion]`, item.IndQuestion);
          formData.append(`${baseIndex}[value]`, item.value);

          if (item.point) {
            formData.append(`${baseIndex}[point]`, item.point);
          }

          if (item.reason) {
            formData.append(`${baseIndex}[reason]`, item.reason);
          }

          if (item.image && item.image.uri) {
            formData.append(`${baseIndex}[image][uri]`, item.image.uri);
            formData.append(`${baseIndex}[image][name]`, item.image.name);
            formData.append(`${baseIndex}[image][type]`, item.image.type);
          }
        });
      });
    });

    // Append car body questions
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

    console.log("Form data ready for submission:", formData);

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

      console.log("Data posted successfully");
      console.log("Response:", response.data.message);

      if (response.data.code == 200) {
        removeProcessedData(obj.tempID);
        console.log("Processed data removed.");
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
