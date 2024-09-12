import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import AppScreen from "../../components/screen/Screen";
import GradientButton from "../../components/buttons/GradientButton";
import InspectionHeader from "../../components/header/InspectionHeader";
import { colors } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectCard from "../../components/card/SelectCard";
import TextCard from "../../components/card/TextCard";
import RangeCard from "../../components/card/RangeCard";
import AppText from "../../components/text/Text";
import { mainStyles } from "../../constants/style";
import { questions } from "../../data/questionsData";

const EditIndicatorsRating = ({ navigation, route }) => {
  const { id, mainCat, subCatName, indQuestion } = route.params || {};
  const [question, setQuestion] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [originalValue, setOriginalValue] = useState(""); // Lock the original value for display

  console.log(question);

  // Fetch question data
  useEffect(() => {
    if (id && mainCat && subCatName && indQuestion) {
      getSingleQuestion(id, mainCat, subCatName, indQuestion);
    } else {
      console.log("Missing parameters for fetching data.");
    }
  }, [id, mainCat, subCatName, indQuestion]);

  useEffect(() => {
    if (question && question.catID) {
      getQuestion(question.catID, subCatName, indQuestion);
    }
  }, [question, subCatName, indQuestion]);

  const getSingleQuestion = async (
    tempID,
    mainCat,
    subCatName,
    indQuestion
  ) => {
    try {
      const storedData = await AsyncStorage.getItem("@carQuestionsdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);

        const carData = carFormDataArray.find(
          (item) =>
            item.QtempID === tempID &&
            item.catName === mainCat &&
            item.subCatName === subCatName &&
            item.IndQuestion === indQuestion
        );

        if (carData) {
          setQuestion(carData);
          setOriginalValue(carData?.value);
          return carData;
        } else {
          console.log("No data found with matching parameters");
          return null;
        }
      } else {
        console.log("No car data found in AsyncStorage");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving car data:", error);
      return null;
    }
  };

  const getQuestion = async (catID, subCatName, indQuestion) => {
    try {
      const mainCategory = questions.find((item) => item.catId === catID);
      if (!mainCategory) return null;

      const subCategory = mainCategory.data.find(
        (subItem) => subItem.subCatName === subCatName
      );
      if (!subCategory) return null;

      const questionData = subCategory.subCatData.find(
        (questionItem) => questionItem.question === indQuestion
      );

      if (questionData) {
        setQuestionData(questionData);
        return questionData;
      } else {
        console.log("Question not found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving question data:", error);
      return null;
    }
  };

  const handleImageSelected = (id, imageUri) => {
    setQuestion((prevQuestion) =>
      prevQuestion.IndID === id
        ? {
            ...prevQuestion,
            image: {
              ...prevQuestion.image,
              uri: imageUri,
            },
          }
        : prevQuestion
    );
  };

  const handleImageNameSelected = (id, imageName) => {
    setQuestion((prevQuestion) =>
      prevQuestion.IndID === id
        ? {
            ...prevQuestion,
            image: {
              ...prevQuestion.image,
              name: imageName,
            },
          }
        : prevQuestion
    );
  };

  const handleRemoveImage = (id) => {
    setQuestion((prevQuestion) =>
      prevQuestion.IndID === id
        ? {
            ...prevQuestion,
            image: {
              uri: null,
              name: null,
            },
          }
        : prevQuestion
    );
  };

  const handleSave = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carQuestionsdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);

        // Find and update the specific question data in the array
        const updatedFormDataArray = carFormDataArray.map((item) => {
          if (
            item.QtempID === id &&
            item.catName === mainCat &&
            item.subCatName === subCatName &&
            item.IndQuestion === indQuestion
          ) {
            const updatedItem = {
              ...item,
              value: question.value, // Save the selected value
              reason:
                question.value !== "No Error" && question.value !== "No Noise"
                  ? question.reason
                  : "", // Save the reason if available
              point: question.value !== "Not Present" ? question.point : "", // Save points if available
            };

            // Set image as an empty string if the value is "Perfect"
            if (
              question.value == "Perfect" ||
              question.value == "ok" ||
              question.value == "No Error"
            ) {
              updatedItem.image = ""; // Set image to an empty string
            } else if (question.image && question.image.uri) {
              // Otherwise, retain the image data
              updatedItem.image = {
                uri: question.image.uri || "",
                name: question.image.name || "",
                type: question.image.type || "image/jpeg", // Ensure to use correct image type if available
              };
            }

            return updatedItem;
          }
          return item;
        });

        // Save the updated data back to AsyncStorage
        await AsyncStorage.setItem(
          "@carQuestionsdata",
          JSON.stringify(updatedFormDataArray)
        );
        console.log("Data successfully saved!");

        navigation.navigate("ViewReport", {
          id: `${id}`,
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Edit Car Info
      </InspectionHeader>
      <View
        style={{
          marginHorizontal: 20,
          backgroundColor: colors.whiteBg,
          padding: 10,
          elevation: 2,
          borderRadius: 5,
          minHeight: 200,
        }}
      >
        <View
          style={{
            backgroundColor: colors.whiteBg,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <AppText fontSize={mainStyles.h2FontSize}>
            Previous {questionData?.type === "r" ? "Rating" : "Value"} is "
            {originalValue}"
          </AppText>
        </View>
        {questionData?.type === "b" && (
          <SelectCard
            key={questionData.id}
            indicator={questionData.question}
            options={questionData.options}
            img={questionData.imgCondition ? true : false}
            condition={questionData.condition}
            imgCondition={questionData.imgCondition}
            textCondition={questionData.textCondition}
            pointsCondition={questionData.pointsCondition}
            points={questionData.points}
            num={questionData.id}
            questionId={questionData.id}
            onValueChange={(selectedValue) => {
              setQuestion((prev) => ({ ...prev, value: selectedValue }));
            }}
            onPointsValueChange={(selectedPointsValue) => {
              setQuestion((prev) => ({ ...prev, point: selectedPointsValue }));
            }}
            onReasonValueChange={(reason) => {
              setQuestion((prev) => ({ ...prev, reason }));
            }}
            onImageSelected={handleImageSelected}
            onSelectedImageName={handleImageNameSelected}
            onRemoveImage={handleRemoveImage}
          />
        )}
        {questionData?.type === "r" && (
          <RangeCard
            key={questionData.id}
            indicator={questionData.question}
            img={false}
            value={question?.value || 0}
            onValueChange={(newValue) => {
              setQuestion((prev) => ({ ...prev, value: newValue }));
            }}
            num={questionData.id}
            questionId={questionData.id}
          />
        )}
        {questionData?.type === "t" && (
          <TextCard
            key={questionData.id}
            indicator={questionData.question}
            value={question?.value || ""}
            placeholder={questionData.placeHolder}
            showType={questionData.showType}
            onValueChange={(newValue) => {
              setQuestion((prev) => ({ ...prev, value: newValue }));
            }}
            num={questionData.id}
            questionId={questionData.id}
          />
        )}
      </View>

      <View style={styles.formButton}>
        <GradientButton onPress={handleSave}>Save</GradientButton>
      </View>
    </AppScreen>
  );
};

export default EditIndicatorsRating;

const styles = StyleSheet.create({
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    bottom: 0,
    backgroundColor: colors.ligtGreyBg,
  },
});
