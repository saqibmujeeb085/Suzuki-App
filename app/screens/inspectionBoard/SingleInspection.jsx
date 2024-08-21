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
import TextCard from "../../components/card/TextCard";
import { questions } from "../../data/questionsData";
import CarBody from "../../components/carBody/CarBody";

const SingleInspection = ({ navigation, route }) => {
  const { tempID, catid, catName } = route.params || {};

  const [questionsData, setQuestionsData] = useState([]);
  const [values, setValues] = useState([]);
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
          reason: "",
          ponit: "",
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
      reason: item.reason,
      point: item.point,
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
      <ScrollView style={{ marginBottom: 100, marginTop: -20 }}>
        {catid === 1 && (
          <Accordion title={"Body Condition"}>
            <CarBody />
          </Accordion>
        )}
        {questionsData.map((subCat, index) => (
          <Accordion key={index} title={subCat.subCatName}>
            <View style={{ gap: 10 }}>
              {subCat.subCatData.map((question, index) => {
                if (question.type === "r") {
                  return (
                    <RangeCard
                      key={question.id}
                      indicator={question.question}
                      img={question.image}
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
                      onValueChange={(newValue) =>
                        handleValueChange(question.id, newValue)
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
                  {
                    return (
                      <TextCard
                        key={question.id}
                        indicator={question.question}
                        value={
                          values.find((val) => val.IndID === question.id)?.value
                        }
                        showType={question.showType}
                        placeholder={question.placeHolder}
                        onValueChange={(newValue) =>
                          handleValueChange(question.id, newValue)
                        }
                        points={question.points}
                        img={question.image}
                        num={question.id}
                        onImageSelected={handleImageSelected}
                        onSelectedImageName={handleImageNameSelected}
                        onRemoveImage={handleRemoveImage}
                      />
                    );
                  }
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
