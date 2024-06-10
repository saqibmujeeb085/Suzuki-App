import { ScrollView, StyleSheet, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import RangeCard from "../../components/card/RangeCard";
import SelectCard from "../../components/card/SelectCard";
import axios from "axios";
import GradientButton from "../../components/buttons/GradientButton";

const SingleInspection = ({ navigation, route }) => {
  const { carid, catid, catName } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [values, setValues] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/auth/get_questions.php?id=${catid}`);
        const data = response.data;
        setQuestions(data);
        // Initialize the values state with the fetched data
        const initialValues = data.map((question) => ({
          carID: carid,
          catID: catid,
          IndID: question.id,
          value: "",
          image: "",
        }));
        setValues(initialValues);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [carid, catid]);

  // Handle value changes
  const handleValueChange = (id, newValue) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.IndID === id ? { ...item, value: newValue } : item
      )
    );
  };

  // Check if all values are filled
  useEffect(() => {
    const hasEmptyValues = values.some((item) => item.value === "");
    setIsButtonDisabled(hasEmptyValues);
  }, [values]);

  // Submit data
  const SubmitData = async () => {
    const hasEmptyValues = values.some((item) => item.value === "");

    if (hasEmptyValues) {
      Alert.alert(
        "Error",
        "Please provide a rating for all questions before submitting."
      );
    } else {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "/auth/add_categoryrating.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        };

        axios.request(config).then((response) => {
          console.log(JSON.stringify(response.data));

          alert(response.data.message);

          if (response.data.status === "success") {
            navigation.goBack();
          }
        });
      } catch (error) {
        console.error("Error submitting data:", error);
        Alert.alert("Error", "Something went wrong!");
      }
    }
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()} rightBtn={"Next"}>
        {catName}
      </InspectionHeader>
      <ScrollView>
        <View style={styles.inspectionContainer}>
          {questions.map((question, index) =>
            question.rating === "r" ? (
              <RangeCard
                key={question.id}
                indicator={question.indicators}
                value={values.find((val) => val.IndID === question.id)?.value}
                onValueChange={(newValue) =>
                  handleValueChange(question.id, newValue)
                }
                num={index}
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
              />
            )
          )}

          <GradientButton onPress={SubmitData} disabled={isButtonDisabled}>
            Submit
          </GradientButton>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default SingleInspection;

const styles = StyleSheet.create({
  inspectionContainer: {
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
});
