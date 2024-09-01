// import React, { createContext, useContext, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { categories } from "../data/categoriesdata";
// import axios from "axios";

// const DataPostContext = createContext();

// const DataPostProvider = ({ children }) => {
//   // Function to remove processed data from AsyncStorage
//   const removeProcessedData = async (processedTempID) => {
//     try {
//       // Retrieve stored data from AsyncStorage
//       const carjsonValue = await AsyncStorage.getItem("@carformdata");
//       const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");

//       if (carjsonValue && questionjsonValue) {
//         // Parse the JSON string into a JavaScript object
//         let carFormData = JSON.parse(carjsonValue);
//         let questionsData = JSON.parse(questionjsonValue);

//         // Ensure the data is an array
//         if (!Array.isArray(carFormData)) {
//           carFormData = [];
//         }
//         if (!Array.isArray(questionsData)) {
//           questionsData = [];
//         }

//         // Filter out the processed data
//         carFormData = carFormData.filter(
//           (obj) => obj.tempID !== processedTempID
//         );
//         questionsData = questionsData.filter(
//           (q) => q.QtempID !== processedTempID
//         );

//         // Update AsyncStorage with the new data
//         await AsyncStorage.setItem("@carformdata", JSON.stringify(carFormData));
//         await AsyncStorage.setItem(
//           "@carQuestionsdata",
//           JSON.stringify(questionsData)
//         );

//         console.log("Processed data removed successfully.");
//       } else {
//         console.log(
//           "No data found in AsyncStorage for @carformdata or @carQuestionsdata."
//         );
//       }
//     } catch (error) {
//       console.error("Error removing processed data:", error);
//     }
//   };

//   // Function to process and upload data
//   const processDataUpload = async () => {
//     try {
//       const carjsonValue = await AsyncStorage.getItem("@carformdata");
//       const questionjsonValue = await AsyncStorage.getItem("@carQuestionsdata");
//       const carbodyjsonValue = await AsyncStorage.getItem(
//         "@carBodyQuestionsdata"
//       );

//       if (carjsonValue && questionjsonValue) {
//         const carFormData = JSON.parse(carjsonValue);
//         const questionsData = JSON.parse(questionjsonValue);
//         const carbodyData = carbodyjsonValue
//           ? JSON.parse(carbodyjsonValue)
//           : [];

//         // console.log(questionsData);

//         // Ensure the data is an array
//         if (Array.isArray(carFormData) && Array.isArray(questionsData)) {
//           carFormData.forEach((obj) => {
//             const ques = questionsData.filter(
//               (item) => item.QtempID == obj.tempID
//             );

//             const carbodyques = carbodyData.filter(
//               (item) => item.tempID === obj.tempID
//             );

//             // console.log("Car body questions:", ques);

//             const groupedData = ques.reduce((acc, item) => {
//               const {
//                 catName,
//                 subCatName,
//                 IndID,
//                 IndQuestion,
//                 value,
//                 point,
//                 reason,
//                 image,
//               } = item;

//               // Find the main category in the accumulator
//               let category = acc.find((cat) => cat.mainCat === catName);

//               if (!category) {
//                 // If the main category does not exist, create a new one
//                 category = {
//                   mainCat: catName,
//                   mainCatData: [],
//                 };
//                 acc.push(category);
//               }

//               // Find the subcategory within the main category
//               let subCategory = category.mainCatData.find(
//                 (subCat) => subCat.subCatName === subCatName
//               );

//               if (!subCategory) {
//                 // If the subcategory does not exist, create a new one
//                 subCategory = {
//                   subCatName: subCatName,
//                   subCatData: [],
//                 };
//                 category.mainCatData.push(subCategory);
//               }

//               // Add the data item to the subcategory
//               const dataItem = {
//                 IndID: IndID,
//                 IndQuestion: IndQuestion,
//                 value: value,
//                 point: point,
//                 reason: reason,
//                 image: image
//                   ? { name: image.name, uri: image.uri, type: image.type }
//                   : {},
//               };

//               subCategory.subCatData.push(dataItem);

//               return acc;
//             }, []);

//             // console.log("Grouped data:", JSON.stringify(groupedData, null, 2));

//             if (obj.status === "inspected") {
//               postData(obj, groupedData, carbodyques);
//             }
//           });
//         } else {
//           console.error("Data retrieved from AsyncStorage is not an array.");
//         }
//       } else {
//         console.log(
//           "No data found in AsyncStorage for @carformdata or @carQuestionsdata."
//         );
//       }
//     } catch (error) {
//       console.error("Error processing data upload:", error);
//     }
//   };

//   const postData = async (obj, groupedData, carbodyques) => {
//     const formData = new FormData();

//     // Append text fields
//     formData.append("dealershipId", obj.dealershipId);
//     formData.append("duserId", obj.duserId);
//     formData.append("customerID", obj.customerID);
//     formData.append("registrationNo", obj.registrationNo);
//     formData.append("chasisNo", obj.chasisNo);
//     formData.append("EngineNo", obj.EngineNo);
//     formData.append("inspectionDate", obj.inspectionDate);
//     formData.append("mfgId", obj.mfgId);
//     formData.append("carId", obj.carId);
//     formData.append("varientId", obj.varientId);
//     formData.append("model", obj.model);
//     formData.append("engineDisplacement", obj.engineDisplacement);
//     formData.append("cplc", obj.cplc);
//     formData.append("buyingCode", obj.buyingCode);
//     formData.append("NoOfOwners", obj.NoOfOwners);
//     formData.append("transmissionType", obj.transmissionType);
//     formData.append("mileage", obj.mileage);
//     formData.append("registrationCity", obj.registrationCity);
//     formData.append("FuelType", obj.FuelType);
//     formData.append("color", obj.color);
//     formData.append("status", obj.status);

//     // Append images and documents
//     if (obj.images && Array.isArray(obj.images)) {
//       obj.images.forEach((image, index) => {
//         if (image.uri) {
//           formData.append(`images[${index}]`, {
//             uri: image.uri,
//             name: image.name,
//             type: image.type,
//           });
//         }
//       });
//     }

//     if (obj.documents && Array.isArray(obj.documents)) {
//       obj.documents.forEach((doc, index) => {
//         if (doc.uri) {
//           formData.append(`documents[${index}]`, {
//             uri: doc.uri,
//             name: doc.name,
//             type: doc.type,
//           });
//         }
//       });
//     }

//     // Iterate through each category in groupedData
//     groupedData.forEach((category, catIndex) => {
//       // Append the main category to FormData
//       formData.append(`data[${catIndex}].mainCat`, category.mainCat);
//       console.log(` data[${catIndex}].mainCat`, category.mainCat);

//       // Iterate through each subCategory within a main category
//       category.mainCatData.forEach((subCategory, subCatIndex) => {
//         // Append the sub-category name to FormData
//         formData.append(
//           `data[${catIndex}].mainCatData[${subCatIndex}].subCatName`,
//           subCategory.subCatName
//         );
//         console.log(
//           ` data[${catIndex}].mainCatData[${subCatIndex}].subCatName`,
//           subCategory.subCatName
//         );

//         // Iterate through each item within a subCategory
//         subCategory.subCatData.forEach((item, itemIndex) => {
//           const baseIndex = `data[${catIndex}].mainCatData[${subCatIndex}].subCatData[${itemIndex}]`;

//           // Append each item's details to FormData
//           formData.append(`${baseIndex}[IndQuestion]`, item.IndQuestion);

//           formData.append(`${baseIndex}[value]`, item.value);

//           if (item.point) {
//             formData.append(`${baseIndex}[point]`, item.point);
//           }

//           if (item.reason) {
//             formData.append(`${baseIndex}[reason]`, item.reason);
//           }

//           if (item.image && item.image.uri) {
//             formData.append(`${baseIndex}[image][uri]`, item.image.uri);

//             formData.append(`${baseIndex}[image][name]`, item.image.name);

//             formData.append(`${baseIndex}[image][type]`, item.image.type);
//           }
//         });
//       });
//     });

//     console.log(formData);

//     try {
//       const headers = {
//         "Content-Type": "multipart/form-data",
//       };

//       const response = await axios.post(
//         "auth/get_carinspectionsnew.php", // Use your server URL
//         formData,
//         {
//           headers: headers,
//         }
//       );

//       if (response.data.code === 200) {
//         removeProcessedData(obj.tempID);
//       } else {
//         console.error("Server responded with an error:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error posting data:", error);
//     }
//   };

//   // Function to trigger manual upload
//   const triggerManualUpload = async () => {
//     await processDataUpload();
//   };

//   return (
//     <DataPostContext.Provider value={{ triggerManualUpload }}>
//       {children}
//     </DataPostContext.Provider>
//   );
// };

// export { DataPostContext, DataPostProvider };

import React, { createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DataPostContext = createContext();

const DataPostProvider = ({ children }) => {
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
              (item) => item.tempID === obj.tempID
            );

            // const groupedData = ques.reduce((acc, item) => {
            //   const {
            //     catName,
            //     subCatName,
            //     IndID,
            //     IndQuestion,
            //     value,
            //     point,
            //     reason,
            //     image,
            //   } = item;

            //   // Find the main category in the accumulator
            //   let category = acc.find((cat) => cat.mainCat === catName);

            //   if (!category) {
            //     // If the main category does not exist, create a new one
            //     category = {
            //       mainCat: catName,
            //       mainCatData: [],
            //     };
            //     acc.push(category);
            //   }

            //   // Find the subcategory within the main category
            //   let subCategory = category.mainCatData.find(
            //     (subCat) => subCat.subCatName === subCatName
            //   );

            //   if (!subCategory) {
            //     // If the subcategory does not exist, create a new one
            //     subCategory = {
            //       subCatName: subCatName,
            //       subCatData: [],
            //     };
            //     category.mainCatData.push(subCategory);
            //   }

            //   // Add the data item to the subcategory
            //   const dataItem = {
            //     IndID: IndID,
            //     IndQuestion: IndQuestion,
            //     value: value,
            //     point: point,
            //     reason: reason,
            //     image: image
            //       ? { name: image.name, uri: image.uri, type: image.type }
            //       : {},
            //   };

            //   subCategory.subCatData.push(dataItem);

            //   return acc;
            // }, []);

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

              // Find the main category in the accumulator
              let category = acc.find((cat) => cat.mainCat == catName);

              if (!category) {
                // If the main category does not exist, create a new one
                category = {
                  mainCat: catName,
                  mainCatData: [],
                };
                acc.push(category);
              }

              // Find the subcategory within the main category
              let subCategory = category.mainCatData.find(
                (subCat) => subCat.subCatName == subCatName
              );

              if (!subCategory) {
                // If the subcategory does not exist, create a new one
                subCategory = {
                  subCatName: subCatName,
                  subCatData: [],
                };
                category.mainCatData.push(subCategory);
              }

              // Add the data item to the subcategory
              const dataItem = {
                IndID: IndID,
                IndQuestion: IndQuestion,
                value: value,
                point: point,
                reason: reason,
                image: image
                  ? { name: image.name, uri: image.uri, type: image.type }
                  : {},
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
    if (obj.images && Array.isArray(obj.images)) {
      obj.images.forEach((image, index) => {
        if (image.uri) {
          const imageData = {
            uri: image.uri,
            type: image.type,
            name: image.name,
          };
          formData.append(`images[${index}]`, imageData);
        }
      });
    }

    if (obj.documents && Array.isArray(obj.documents)) {
      obj.documents.forEach((doc, index) => {
        if (doc.uri) {
          const docData = {
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
          };
          formData.append(`documents[${index}]`, docData);
        }
      });
    }

    groupedData.forEach((category, catIndex) => {
      // Append the main category to FormData
      formData.append(`data[${catIndex}][mainCat]`, category.mainCat);

      // Iterate through each subCategory within a main category
      category.mainCatData.forEach((subCategory, subCatIndex) => {
        // Append the sub-category name to FormData
        formData.append(
          `data[${catIndex}][mainCatData][${subCatIndex}][subCatName]`,
          subCategory.subCatName
        );

        // Iterate through each item within a subCategory
        subCategory.subCatData.forEach((item, itemIndex) => {
          const baseIndex = `data[${catIndex}][mainCatData][${subCatIndex}][subCatData][${itemIndex}]`;

          // Append each item's details to FormData
          formData.append(`${baseIndex}[IndQuestion]`, item.IndQuestion);
          formData.append(`${baseIndex}[value]`, item.value);

          if (item.point) {
            formData.append(`${baseIndex}[point]`, item.point);
          }

          if (item.reason) {
            formData.append(`${baseIndex}[reason]`, item.reason);
          }

          // Append the actual file object to FormData
          if (item.image && item.image.uri) {
            const file = item.image; // Assuming item.image is the File object
            formData.append(`${baseIndex}[image]`, file, file.name);
            console.log(`${baseIndex}[image]:`, file); // Logging the image details
          }
        });
      });
    });

    // console.log(formData);

    // try {
    //   const headers = {
    //     "Content-Type": "multipart/form-data",
    //   };

    //   const response = await axios.post(
    //     "auth/get_carinspectionsnew.php", // Use your server URL
    //     formData,
    //     {
    //       headers: headers,
    //     }
    //   );

    //   if (response.data.success) {
    //     // removeProcessedData(obj.tempID);

    //     console.log(response.data);
    //   } else {
    //     console.error("Server responded with an error:", response.data.message);
    //   }
    // } catch (error) {
    //   console.error("Error posting data:", error);
    // }
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
