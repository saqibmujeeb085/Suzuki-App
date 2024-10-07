import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import RangeCard from "../../components/card/RangeCard";
import SelectCard from "../../components/card/SelectCard";
import GradientButton from "../../components/buttons/GradientButton";
import ToastManager from "toastify-react-native";
import { colors } from "../../constants/colors";
import Accordion from "../../components/accordian/Accordian";
import TextCard from "../../components/card/TextCard";
import { questions } from "../../data/questionsData";
import CarBody from "../../components/carBody/CarBody";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SingleInspection = ({ navigation, route }) => {
  const { tempID, catid, catName } = route.params || {};

  const [questionsData, setQuestionsData] = useState([]);
  const [values, setValues] = useState([]);
  const [validationErrors, setValidationErrors] = useState({}); // Separate error state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

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
      console.log("tempID or catid is not provided");
      return;
    }

    setLoading(true);
    const data = getDataById(catid);
    if (data) {
      const initialValues = data.flatMap((subCat) =>
        subCat.subCatData.map((question) => ({
          QtempID: `${tempID}`,
          carID: "",
          type: question.type,
          catID: catid,
          catName: `${catName}`,
          subCatName: subCat.subCatName,
          IndID: question.id,
          IndQuestion: question.question,
          value: "",
          image: {
            uri: null,
            name: null,
            type: "image/jpeg",
          },
          reasonValue: "",
          ponitValue: "",
        }))
      );
      setValues(initialValues);
    }
    setLoading(false);
  }, [tempID, catid]);

  // Function to validate a specific question (only for previous fields)
  const validatePreviousFields = (id) => {
    const currentIndex = values.findIndex((item) => item.IndID === id);
    const newValidationErrors = { ...validationErrors }; // Clone the existing errors

    values.forEach((item, index) => {
      if (index < currentIndex && (!item.value || item.value === "")) {
        newValidationErrors[item.IndID] = true; // Only validate previous questions
      }
    });

    setValidationErrors(newValidationErrors);

    // Check if any error exists in the previous fields
    return Object.values(newValidationErrors).some((error) => error);
  };

  // Updated real-time value change handler (exclude current field from validation)
  const handleValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, value: newValue } : item
      )
    );

    // Update validation state for the current field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: !newValue, // Remove error only if the newValue is filled
    }));

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const handleTextValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, value: newValue } : item
      )
    );

    // Update validation state for the current field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: !newValue, // Remove error only if the newValue is filled
    }));

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const handlePonitsValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, ponitValue: newValue } : item
      )
    );

    // Update validation state for the current field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: !newValue, // Remove error only if the newValue is filled
    }));

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const handleImageSelected = (id, imageUri) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id
          ? { ...item, image: { ...item.image, uri: imageUri } }
          : item
      )
    );

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const handleReasonValueChange = (id, newReason) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, reasonValue: newReason } : item
      )
    );

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const handleImageNameSelected = (id, imageName) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id
          ? { ...item, image: { ...item.image, name: imageName } }
          : item
      )
    );

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const handleRemoveImage = (id) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, image: { uri: null, name: null } } : item
      )
    );

    // Validate all previous fields only
    validatePreviousFields(id);
  };

  const saveQuestionsData = async () => {
    // Validate all previous fields before saving
    const hasErrors = validatePreviousFields(values[values.length - 1].IndID); // Validate until the last question

    if (hasErrors) {
      return; // If there are errors, don't proceed with saving
    }

    setLoading(true);

    const questionValues = values.map((item) => ({
      QtempID: item.QtempID,
      carID: item.carID,
      catID: item.catID,
      type: item.type,
      catName: item.catName,
      subCatName: item.subCatName,
      IndID: item.IndID,
      IndQuestion: item.IndQuestion,
      value: item.value,
      reason: item.reasonValue,
      point: item.ponitValue,
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
      console.log("Error saving questions values:", error);
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <ToastManager />
      <InspectionHeader onPress={() => navigation.goBack()} rightBtn={"Next"}>
        {catName}
      </InspectionHeader>
      <ScrollView style={{ marginBottom: 100, marginTop: -20 }}>
        {catid === 1 && (
          <Accordion title={"Body Condition"}>
            <CarBody tempID={tempID} />
          </Accordion>
        )}
        {questionsData.map((subCat, index) => (
          <Accordion key={index} title={subCat.subCatName}>
            <View style={{ gap: 10 }}>
              {subCat.subCatData.map((question, index) => {
                const error = validationErrors[question.id]; // Check for validation error
                if (question.type === "r") {
                  return (
                    <RangeCard
                      key={question.id}
                      indicator={question.question}
                      img={question.image}
                      value={
                        values.find((val) => val.IndID === question.id)?.value
                      }
                      error={error} // Pass error state here
                      onValueChange={(newValue) =>
                        handleValueChange(question.id, newValue)
                      }
                      num={question.id}
                      questionId={question.id}
                      onImageSelected={handleImageSelected}
                      onSelectedImageName={handleImageNameSelected}
                      onRemoveImage={handleRemoveImage}
                    />
                  );
                } else if (question.type === "b") {
                  return (
                    <SelectCard
                      key={question.id}
                      indicator={question.question}
                      options={question.options}
                      img={question.image}
                      condition={question.condition}
                      imgCondition={question.imgCondition}
                      textCondition={question.textCondition}
                      pointsCondition={question.pointsCondition}
                      value={
                        values.find((val) => val.IndID === question.id)?.value
                      }
                      error={error} // Pass error state here
                      onValueChange={(newValue) =>
                        handleValueChange(question.id, newValue)
                      }
                      onPointsValueChange={(newValue) =>
                        handlePonitsValueChange(question.id, newValue)
                      }
                      onReasonValueChange={(newReason) =>
                        handleReasonValueChange(question.id, newReason)
                      }
                      points={question.points}
                      num={question.id}
                      questionId={question.id}
                      onImageSelected={handleImageSelected}
                      onSelectedImageName={handleImageNameSelected}
                      onRemoveImage={handleRemoveImage}
                    />
                  );
                } else if (question.type === "t") {
                  return (
                    <TextCard
                      key={question.id}
                      indicator={question.question}
                      value={
                        values.find((val) => val.IndID === question.id)?.value
                      }
                      error={error} // Pass error state here
                      showType={question.showType}
                      placeholder={question.placeHolder}
                      onValueChange={(newValue) =>
                        handleTextValueChange(question.id, newValue)
                      }
                      points={question.points}
                      img={question.image}
                      num={question.id}
                      onImageSelected={handleImageSelected}
                      onSelectedImageName={handleImageNameSelected}
                      onRemoveImage={handleRemoveImage}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </View>
          </Accordion>
        ))}
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton onPress={saveQuestionsData} disabled={isButtonDisabled}>
          {loading ? "Loading..." : "Submit"}
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
