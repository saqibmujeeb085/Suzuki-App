import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import RangeCard from "../../components/card/RangeCard";
import SelectCard from "../../components/card/SelectCard";
import GradientButton from "../../components/buttons/GradientButton";
import ToastManager from "toastify-react-native";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import AppText from "../../components/text/Text";
import Accordion from "../../components/accordian/Accordian";

const SingleInspection = ({ navigation, route }) => {
  const { tempID, catid, catName } = route.params || {};

  const [questionsData, setQuestionsData] = useState([]);
  const [values, setValues] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      catId: 1,
      data: [
        {
          subCatId: 1,
          subCatName: "Body Frame",
          subCatData: [
            {
              id: 1,
              type: "r",
              question: "Engine Performance",
              condition: false,
              options: [],
              image: true,
              textBox: false,
              points: [],
            },
            {
              id: 2,
              type: "b",
              question: "Acceleration and power",
              condition: true,
              options: [{ key: 1, value: "ok", label: "sai ha" }],
              image: false,
              textBox: true,
              points: [],
            },
            {
              id: 3,
              type: "t",
              question: "Engine Mounts",
              condition: true,
              options: [],
              image: false,
              textBox: true,
              points: [
                {
                  key: 1,
                  label: "black",
                  value: "black",
                },
              ],
            },
          ],
        },
        {
          subCatId: 2,
          subCatName: "Body Additional",
          subCatData: [
            {
              id: 4,
              type: "r",
              question: "Engine Performance",
              condition: false,
              options: [],
              image: true,
              textBox: false,
              points: [],
            },
            {
              id: 5,
              type: "b",
              question: "Acceleration and power",
              condition: true,
              options: [{ key: 1, value: "ok", label: "sai ha" }],
              image: false,
              textBox: true,
              points: [],
            },
            {
              id: 6,
              type: "t",
              question: "Engine Mounts",
              condition: true,
              options: [],
              image: false,
              textBox: true,
              points: [
                {
                  key: 1,
                  label: "black",
                  value: "black",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const getDataById = (catid) => {
    const category = questions.find((item) => item.catId === catid);
    if (category) {
      setQuestionsData(category.data);
      return category.data;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!tempID || !catid) {
      console.error("tempID or catid is not provided");
      return;
    }

    setLoading(true);
    const data = getDataById(catid);
    if (data) {
      const initialValues = data.flatMap((subCat) =>
        subCat.subCatData.map((question) => ({
          QtempID: `${tempID}`,
          carID: "",
          catID: catid,
          IndID: question.id,
          value: "",
          image: {
            uri: null,
            name: null,
            type: "image/jpeg",
          },
        }))
      );
      setValues(initialValues);
    }
    setLoading(false);
  }, [tempID, catid]);

  const handleValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, value: newValue } : item
      )
    );
  };

  const handleImageSelected = (id, imageUri) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id
          ? { ...item, image: { ...item.image, uri: imageUri } }
          : item
      )
    );
  };

  const handleImageNameSelected = (id, imageName) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id
          ? { ...item, image: { ...item.image, name: imageName } }
          : item
      )
    );
  };

  const handleRemoveImage = (id) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, image: { uri: null, name: null } } : item
      )
    );
  };

  useEffect(() => {
    const hasEmptyValues = values.some((item) => item.value === "");
    setIsButtonDisabled(hasEmptyValues);
  }, [values]);

  const saveQuestionsData = async () => {
    setLoading(true);

    const questionValues = values.map((item) => ({
      QtempID: item.QtempID,
      carID: item.carID,
      catID: item.catID,
      IndID: item.IndID,
      value: item.value,
      ...(item.image &&
        item.image.uri && {
          image: {
            uri: item.image.uri,
            name: item.image.name,
            type: item.image.type,
          },
        }),
    }));

    try {
      const storedData = await AsyncStorage.getItem("@carQuestionsdata");
      const existingData = storedData ? JSON.parse(storedData) : [];
      const updatedData = [...existingData, ...questionValues];
      await AsyncStorage.setItem(
        "@carQuestionsdata",
        JSON.stringify(updatedData)
      );

      setLoading(false);
      navigation.navigate("InspectionBoard", {
        id: tempID,
      });
    } catch (error) {
      console.error("Error saving questions values:", error);
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <ToastManager />
      <InspectionHeader onPress={() => navigation.goBack()} rightBtn={"Next"}>
        {catName}
      </InspectionHeader>
      <ScrollView style={{ marginBottom: 90, marginTop: -20 }}>
        {questionsData.map((subCat, index) => (
          <Accordion key={index} title={subCat.subCatName}>
            <View style={{ gap: 10 }}>
              {subCat.subCatData.map((question, index) =>
                question.type === "r" ? (
                  <RangeCard
                    key={question.id}
                    indicator={question.indicators}
                    value={
                      values.find((val) => val.IndID === question.id)?.value
                    }
                    onValueChange={(newValue) =>
                      handleValueChange(question.id, newValue)
                    }
                    // img={}
                    num={question.id}
                    questionId={question.id}
                    onImageSelected={handleImageSelected}
                    onSelectedImageName={handleImageNameSelected}
                    onRemoveImage={handleRemoveImage}
                  />
                ) : (
                  <SelectCard
                    key={question.id}
                    indicator={question.indicators}
                    value={
                      values.find((val) => val.IndID === question.id)?.value
                    }
                    onValueChange={(newValue) =>
                      handleValueChange(question.id, newValue)
                    }
                    num={question.id}
                    questionId={question.id}
                    onImageSelected={handleImageSelected}
                    onSelectedImageName={handleImageNameSelected}
                    onRemoveImage={handleRemoveImage}
                  />
                )
              )}
            </View>
          </Accordion>
        ))}
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton onPress={saveQuestionsData} disabled={isButtonDisabled}>
          Submit
        </GradientButton>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});

export default SingleInspection;

// import { ScrollView, StyleSheet, View } from "react-native";
// import React, { useState, useEffect, useContext } from "react";
// import AppScreen from "../../components/screen/Screen";
// import InspectionHeader from "../../components/header/InspectionHeader";
// import RangeCard from "../../components/card/RangeCard";
// import SelectCard from "../../components/card/SelectCard";
// import GradientButton from "../../components/buttons/GradientButton";
// import SingleInspectionSkeletonPreloader from "../../components/skeletonLoader/SingleInspectionSkeletonPreloader";
// import ToastManager from "toastify-react-native";
// import { mainStyles } from "../../constants/style";
// import { colors } from "../../constants/colors";
// import { QuesAndAnsContext } from "../../context/questionAndCategories";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import TextCard from "../../components/card/TextCard";
// import AppText from "../../components/text/Text";

// const SingleInspection = ({ navigation, route }) => {
//   const { tempID, catid, catName } = route.params || {};

//   // const [categories, setCategories, questions, setQuestions] =
//   useContext(QuesAndAnsContext);
//   const [questionsData, setQuestionsData] = useState([]);
//   const [values, setValues] = useState([]);
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const questions = [
//     {
//       catId: 1,
//       data: [
//         {
//           subCatId: 1,
//           subCatName: "Body Frame",
//           subCatData: [
//             {
//               id: 1,
//               type: "r",
//               question: "Engine Performance",
//               condition: false,
//               options: [],
//               image: true,
//               textBox: false,
//               points: [],
//             },
//             {
//               id: 2,
//               type: "b",
//               question: "Acceleration and power",
//               condition: true,
//               options: [{ key: 1, value: "ok", labal: "sai ha" }],
//               image: false,
//               textBox: true,
//               points: [],
//             },
//             {
//               id: 3,
//               type: "t",
//               question: "Engine Mounts",
//               condition: true,
//               options: [],
//               image: false,
//               textBox: true,
//               points: [
//                 {
//                   key: 1,
//                   label: "black",
//                   value: "black",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           subCatId: 2,
//           subCatName: "Body Additoinal",
//           subCatData: [
//             {
//               id: 1,
//               type: "r",
//               question: "Engine Performance",
//               condition: false,
//               options: [],
//               image: true,
//               textBox: false,
//               points: [],
//             },
//             {
//               id: 2,
//               type: "b",
//               question: "Acceleration and power",
//               condition: true,
//               options: [{ key: 1, value: "ok", labal: "sai ha" }],
//               image: false,
//               textBox: true,
//               points: [],
//             },
//             {
//               id: 3,
//               type: "t",
//               question: "Engine Mounts",
//               condition: true,
//               options: [],
//               image: false,
//               textBox: true,
//               points: [
//                 {
//                   key: 1,
//                   label: "black",
//                   value: "black",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   const getDataById = (catid) => {
//     const category = questions.find((item) => item.catId === catid);
//     if (category) {
//       setQuestionsData(category.data);
//       return category.data;
//     } else {
//       return null;
//     }
//   };

//   // console.log(questionsData);

//   useEffect(() => {
//     if (!tempID || !catid) {
//       console.error("tempID or catid is not provided");
//       return;
//     }

//     setLoading(true);
//     getDataById(catid);
//     const initialValues = questionsData.map((question) => ({
//       QtempID: `${tempID}`,
//       carID: "",
//       catID: catid,
//       IndID: question.id,
//       value: "",
//       image: {
//         uri: null,
//         name: null,
//         type: "image/jpeg",
//       },
//     }));
//     setValues(initialValues);
//     setLoading(false);
//   }, [tempID, catid, questionsData]);

//   const handleValueChange = (id, newValue) => {
//     setValues((prevValues) =>
//       prevValues.map((item) =>
//         item.IndID === id ? { ...item, value: newValue } : item
//       )
//     );
//   };

//   const handleImageSelected = (id, imageUri) => {
//     setValues((prevValues) =>
//       prevValues.map((item) =>
//         item.IndID === id
//           ? { ...item, image: { ...item.image, uri: imageUri } }
//           : item
//       )
//     );
//   };

//   const handleImageNameSelected = (id, imageName) => {
//     setValues((prevValues) =>
//       prevValues.map((item) =>
//         item.IndID === id
//           ? { ...item, image: { ...item.image, name: imageName } }
//           : item
//       )
//     );
//   };

//   const handleRemoveImage = (id) => {
//     setValues((prevValues) =>
//       prevValues.map((item) =>
//         item.IndID === id ? { ...item, image: { uri: null, name: null } } : item
//       )
//     );
//   };

//   useEffect(() => {
//     const hasEmptyValues = values.some((item) => item.value === "");
//     setIsButtonDisabled(hasEmptyValues);
//   }, [values]);

//   // const checkStoredData = async () => {
//   //   try {
//   //     const storedData = await AsyncStorage.getItem("@carQuestionsdata");
//   //     if (storedData) {
//   //       console.log(
//   //         "Stored Data: jiji",
//   //         JSON.parse(storedData)
//   //       );
//   //     } else {
//   //       console.log("No data found in AsyncStorage");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error retrieving data from AsyncStorage:", error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   checkStoredData();
//   // }, []);

//   const saveQuestionsData = async () => {
//     setLoading(true);

//     const questionValues = values.map((item) => ({
//       QtempID: item.QtempID,
//       carID: item.carID,
//       catID: item.catID,
//       IndID: item.IndID,
//       value: item.value,
//       ...(item.image &&
//         item.image.uri && {
//           image: {
//             uri: item.image.uri,
//             name: item.image.name,
//             type: item.image.type,
//           },
//         }),
//     }));

//     try {
//       // Retrieve existing data from AsyncStorage
//       const storedData = await AsyncStorage.getItem("@carQuestionsdata");
//       const existingData = storedData ? JSON.parse(storedData) : [];

//       // Append new data to the existing data
//       const updatedData = [...existingData, ...questionValues];

//       // Save the combined data back to AsyncStorage
//       await AsyncStorage.setItem(
//         "@carQuestionsdata",
//         JSON.stringify(updatedData)
//       );

//       setLoading(false);
//       navigation.navigate("InspectionBoard", {
//         id: tempID,
//       });
//     } catch (error) {
//       console.error("Error saving questions values:", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <AppScreen>
//       <ToastManager />
//       <InspectionHeader onPress={() => navigation.goBack()} rightBtn={"Next"}>
//         {catName}
//       </InspectionHeader>
//       <ScrollView style={{ marginBottom: 90 }}>
//         {questionsData.map((question, index) => {
//           <View>
//             <AppText>{question.subCatName}</AppText>
//           </View>;
//         })}
//         {/* {loading ? (
//           <View style={styles.inspectionContainer}>
//             {Array(10)
//               .fill(0)
//               .map((_, index) => (
//                 <SingleInspectionSkeletonPreloader key={index} />
//               ))}
//           </View>
//         ) : (
//           <View style={styles.inspectionContainer}>
//             {questionsData.map((question, index) =>
//               question.rating === "r" ? (
//                 <RangeCard
//                   key={question.id}
//                   indicator={question.indicators}
//                   value={values.find((val) => val.IndID === question.id)?.value}
//                   onValueChange={(newValue) =>
//                     handleValueChange(question.id, newValue)
//                   }
//                   num={index}
//                   questionId={question.id}
//                   onImageSelected={handleImageSelected}
//                   onSelectedImageName={handleImageNameSelected}
//                   onRemoveImage={handleRemoveImage}
//                 />
//               ) : (
//                 <SelectCard
//                   key={question.id}
//                   indicator={question.indicators}
//                   value={values.find((val) => val.IndID === question.id)?.value}
//                   onValueChange={(newValue) =>
//                     handleValueChange(question.id, newValue)
//                   }
//                   num={index}
//                   questionId={question.id}
//                   onImageSelected={handleImageSelected}
//                   onSelectedImageName={handleImageNameSelected}
//                   onRemoveImage={handleRemoveImage}
//                 />
//               )
//             )}
//           </View>
//         )} */}
//       </ScrollView>
//       <View style={styles.formButton}>
//         <GradientButton onPress={saveQuestionsData} disabled={isButtonDisabled}>
//           Submit
//         </GradientButton>
//       </View>
//     </AppScreen>
//   );
// };

// const styles = StyleSheet.create({
//   inspectionContainer: {
//     gap: 20,
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   formButton: {
//     position: "absolute",
//     bottom: 0,
//     padding: 20,
//     width: "100%",
//     backgroundColor: colors.ligtGreyBg,
//   },
// });

// export default SingleInspection;
