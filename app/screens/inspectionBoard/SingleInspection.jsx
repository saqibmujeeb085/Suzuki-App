import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import GradientButton from "../../components/buttons/GradientButton";
import ToastManager from "toastify-react-native";
import { colors } from "../../constants/colors";
import Accordion from "../../components/accordian/Accordian";
import TextCard from "../../components/card/TextCard";
import { questions } from "../../data/questionsData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RangeCard from "../../components/card/RangeCard";
import SelectCard from "../../components/card/SelectCard";
import CarBody from "../../components/carBody/CarBody";

const SingleInspection = ({ navigation, route }) => {
  const { tempID, catid, catName } = route.params || {};

  const [questionsData, setQuestionsData] = useState([]);
  const [values, setValues] = useState([]);
  const [errors, setErrors] = useState({}); // State to track errors
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

  // Handle value change and set errors for preceding fields
  const handleValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, value: newValue } : item
      )
    );

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Remove error for the current field if it is filled
      if (newValue) {
        delete newErrors[id];
      }

      // Add errors for all preceding fields that are empty
      const fieldIndex = values.findIndex((item) => item.IndID === id);
      for (let i = 0; i < fieldIndex; i++) {
        if (!values[i].value) {
          newErrors[values[i].IndID] = "This field must be filled.";
        }
      }

      return newErrors;
    });
  };
  // Handle real-time value change

  const handleTextValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, value: newValue } : item
      )
    );
  };

  const handlePonitsValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, ponitValue: newValue } : item
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

  const handleReasonValueChange = (id, newReason) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, reasonValue: newReason } : item
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

  const saveQuestionsData = async () => {
    const hasEmptyFields = values.some((item) => !item.value); // Check for unfilled questions
    if (hasEmptyFields) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        values.forEach((item) => {
          if (!item.value) {
            newErrors[item.IndID] = "This field must be filled.";
          }
        });
        return newErrors;
      });
      return; // Exit if there are unfilled fields
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
  const fieldIsFilled = (id) => {
    const fieldValue = values.find((item) => item.IndID === id)?.value;
    return !!fieldValue; // Returns true if the field has a value
  };

  useEffect(() => {
    viewStoredData();
    // Disable the button if any fields are empty
    const hasEmptyFields = values.some((item) => !item.value);
    setIsButtonDisabled(hasEmptyFields);
  }, [values]);
  const viewStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carQuestionsdata");
      const parsedData = storedData ? JSON.parse(storedData) : [];
      console.log("Stored Data:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Error fetching stored data:", error);
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
                const isFilled = fieldIsFilled(question.id);
                const isError = errors[question.id]; // Check if there's an error for this field
                return (
                  <View key={question.id}>
                    {question.type === "r" && (
                      <RangeCard
                        indicator={question.question}
                        img={question.image}
                        value={
                          values.find((val) => val.IndID === question.id)?.value
                        }
                        error={isError} // Pass true if the field is filled
                        onValueChange={(newValue) =>
                          handleValueChange(question.id, newValue)
                        }
                        num={question.id}
                        questionId={question.id}
                        onImageSelected={handleImageSelected}
                        onSelectedImageName={handleImageNameSelected}
                        onRemoveImage={handleRemoveImage}
                      />
                    )}
                    {question.type === "b" && (
                      <SelectCard
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
                        error={isError} // Pass true if the field is filled
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
                    )}
                    {question.type === "t" && (
                      <TextCard
                        indicator={question.question}
                        value={
                          values.find((val) => val.IndID === question.id)?.value
                        }
                        error={isError}
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
                        val={isFilled}
                      />
                    )}
                    {isError && (
                      <Text style={{ color: "red", fontSize: 12 }}>
                        {isError}
                      </Text>
                    )}
                  </View>
                );
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
