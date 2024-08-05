import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import RangeCard from "../../components/card/RangeCard";
import SelectCard from "../../components/card/SelectCard";
import GradientButton from "../../components/buttons/GradientButton";
import SingleInspectionSkeletonPreloader from "../../components/skeletonLoader/SingleInspectionSkeletonPreloader";
import ToastManager from "toastify-react-native";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import { QuesAndAnsContext } from "../../context/questionAndCategories";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SingleInspection = ({ navigation, route }) => {
  const { tempID, catid, catName } = route.params || {};

  const [categories, setCategories, questions, setQuestions] =
    useContext(QuesAndAnsContext);
  const [questionsData, setQuestionsData] = useState([]);
  const [values, setValues] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const getDataById = (catId) => {
    const category = questions.find((item) => item.catId === catId);
    if (category) {
      setQuestionsData(category.data);
      return category.data;
    } else {
      return null; // No category found with the provided catId
    }
  };

  useEffect(() => {
    if (!tempID || !catid) {
      console.error("tempID or catid is not provided");
      return;
    }

    setLoading(true);
    getDataById(catid);
    const initialValues = questionsData.map((question) => ({
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
    }));
    setValues(initialValues);
    setLoading(false);
  }, [tempID, catid, questionsData]);

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

  // const checkStoredData = async () => {
  //   try {
  //     const storedData = await AsyncStorage.getItem("@carQuestionsdata");
  //     if (storedData) {
  //       console.log(
  //         "Stored Data: 1111111111111111111111111111111111111111111--------------------------------------------------------------------------------",
  //         JSON.parse(storedData)
  //       );
  //     } else {
  //       console.log("No data found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving data from AsyncStorage:", error);
  //   }
  // };

  // useEffect(() => {
  //   checkStoredData();
  // }, []);

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
      // Retrieve existing data from AsyncStorage
      const storedData = await AsyncStorage.getItem("@carQuestionsdata");
      const existingData = storedData ? JSON.parse(storedData) : [];

      // Append new data to the existing data
      const updatedData = [...existingData, ...questionValues];

      // Save the combined data back to AsyncStorage
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
      <ScrollView style={{ marginBottom: 90 }}>
        {loading ? (
          <View style={styles.inspectionContainer}>
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <SingleInspectionSkeletonPreloader key={index} />
              ))}
          </View>
        ) : (
          <View style={styles.inspectionContainer}>
            {questionsData.map((question, index) =>
              question.rating === "r" ? (
                <RangeCard
                  key={question.id}
                  indicator={question.indicators}
                  value={values.find((val) => val.IndID === question.id)?.value}
                  onValueChange={(newValue) =>
                    handleValueChange(question.id, newValue)
                  }
                  num={index}
                  questionId={question.id}
                  onImageSelected={handleImageSelected}
                  onSelectedImageName={handleImageNameSelected}
                  onRemoveImage={handleRemoveImage}
                />
              ) : (
                <SelectCard
                  key={question.id}
                  indicator={question.indicators}
                  value={values.find((val) => val.IndID === question.id)?.value}
                  onValueChange={(newValue) =>
                    handleValueChange(question.id, newValue)
                  }
                  num={index}
                  questionId={question.id}
                  onImageSelected={handleImageSelected}
                  onSelectedImageName={handleImageNameSelected}
                  onRemoveImage={handleRemoveImage}
                />
              )
            )}
          </View>
        )}
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
  inspectionContainer: {
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});

export default SingleInspection;
