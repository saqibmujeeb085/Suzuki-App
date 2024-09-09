import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import InspectionHeader from "../../components/header/InspectionHeader";
import { colors } from "../../constants/colors";
import GradientButton from "../../components/buttons/GradientButton";
import { RadioGroup } from "react-native-radio-buttons-group";
import Checkbox from "expo-checkbox";
import { mainStyles } from "../../constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProblems = ({ navigation, route }) => {
  const { id, location } = route.params || {};

  const [problems, setProblems] = useState({
    "Paint Marked": {
      checked: false,
      selectedId: null,
      selectedValue: null,
    },
    Dent: { checked: false, selectedId: null, selectedValue: null },
    Scratch: { checked: false, selectedId: null, selectedValue: null },
  });
  const [carBodyProblems, setCarBodyProblems] = useState(null);

  console.log(carBodyProblems);

  useEffect(() => {
    getCarProblemsDataByTempID(id, location);
  }, [id, location]);

  // Load data from AsyncStorage and preselect values
  const getCarProblemsDataByTempID = async (tempID, location) => {
    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);

        // Find the object where both tempID and problemLocation match
        const carbodyques = carFormDataArray.find(
          (item) => item.tempID == tempID && item.problemLocation === location
        );

        if (carbodyques) {
          setCarBodyProblems(carbodyques);
          // Preselect the values from stored data
          const updatedProblems = { ...problems };
          carbodyques.problems.forEach((problem) => {
            if (updatedProblems[problem.problemName]) {
              updatedProblems[problem.problemName].checked = true;
              updatedProblems[problem.problemName].selectedValue =
                problem.selectedValue;
              updatedProblems[problem.problemName].selectedId = points[
                problem.problemName
              ]?.find((p) => p.value === problem.selectedValue)?.id;
            }
          });
          setProblems(updatedProblems);
        } else {
          console.log(
            "No data found with tempID and problemLocation:",
            tempID,
            location
          );
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

  // Radio button options
  const points = {
    "Paint Marked": [
      {
        id: "1",
        label: "Shower Paint",
        value: "Shower Paint",
        color: colors.purple,
      },
      {
        id: "2",
        label: "Polycate paint",
        value: "Polycate paint",
        color: colors.purple,
      },
    ],
    Dent: [
      {
        id: "3",
        label: "Minor Dent",
        value: "Minor Dent",
        color: colors.purple,
      },
      {
        id: "4",
        label: "Major Dent",
        value: "Major Dent",
        color: colors.purple,
      },
    ],
    Scratch: [
      {
        id: "5",
        label: "Minor Scratch",
        value: "Minor Scratch",
        color: colors.purple,
      },
      {
        id: "6",
        label: "Major Scratch",
        value: "Major Scratch",
        color: colors.purple,
      },
    ],
  };

  // Toggle problem checked/unchecked state
  const handleProblemToggle = (problem) => {
    setProblems((prev) => {
      const updatedProblem = {
        ...prev[problem],
        checked: !prev[problem].checked,
        selectedId: prev[problem].checked ? null : prev[problem].selectedId,
        selectedValue: prev[problem].checked
          ? null
          : prev[problem].selectedValue,
      };

      // When unchecked, clear selected values
      if (!updatedProblem.checked) {
        updatedProblem.selectedId = null;
        updatedProblem.selectedValue = null;
      }

      return {
        ...prev,
        [problem]: updatedProblem,
      };
    });
  };

  // Handle radio button selection
  const handleSubProblemSelect = (problem, selectedId) => {
    const selectedOption = points[problem].find(
      (radio) => radio.id === selectedId
    );
    const selectedValue = selectedOption ? selectedOption.value : null;

    setProblems((prev) => ({
      ...prev,
      [problem]: {
        ...prev[problem],
        selectedId: selectedId,
        selectedValue: selectedValue,
      },
    }));
  };

  // Save the updated data back to AsyncStorage
  const handleSave = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");
      if (storedData !== null) {
        let carFormDataArray = JSON.parse(storedData);

        // Find the existing data for the given tempID and location
        const updatedData = carFormDataArray.map((item) => {
          if (item.tempID === id && item.problemLocation === location) {
            return {
              ...item,
              problems: Object.keys(problems)
                .filter(
                  (key) => problems[key].checked && problems[key].selectedValue // Save only if checked and selectedValue exists
                )
                .map((key) => ({
                  problemName: key,
                  selectedValue: problems[key].selectedValue,
                })),
            };
          }
          return item;
        });

        // Save updated data back to AsyncStorage
        await AsyncStorage.setItem(
          "@carBodyQuestionsdata",
          JSON.stringify(updatedData)
        );

        console.log("Data updated successfully!");
        navigation.navigate("ViewReport", {
          id: `${id}`,
        });
      }
    } catch (error) {
      console.error("Error saving car data:", error);
    }
  };
  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Edit Car Problems
      </InspectionHeader>
      <View
        style={{
          marginHorizontal: 20,
          padding: 20,
          backgroundColor: colors.whiteBg,
          borderRadius: 5,
          elevation: 2,
          marginBottom: 10,
        }}
      >
        <AppText
          fontSize={mainStyles.h1FontSize}
          fontFamily={mainStyles.appFontBold}
          textAlign={"center"}
        >
          {carBodyProblems?.problemLocation}
        </AppText>
      </View>
      <View style={styles.problemList}>
        {Object.keys(points).map((problem) => (
          <View key={problem}>
            <View style={styles.problemRow}>
              <Checkbox
                onValueChange={() => handleProblemToggle(problem)}
                color={problems[problem].checked ? colors.purple : undefined}
                value={problems[problem].checked}
                style={{ height: 25, width: 25 }}
              />
              <AppText fontSize={mainStyles.h2FontSize}>
                {problem.charAt(0).toUpperCase() + problem.slice(1)}
              </AppText>
            </View>
            {problems[problem].checked && (
              <View style={styles.subProblemContainer}>
                <RadioGroup
                  containerStyle={styles.radioGroup}
                  radioButtons={points[problem]}
                  onPress={(selectedId) =>
                    handleSubProblemSelect(problem, selectedId)
                  }
                  selectedId={problems[problem].selectedId}
                />
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={styles.formButton}>
        <GradientButton onPress={handleSave}>Save</GradientButton>
      </View>
    </AppScreen>
  );
};

export default EditProblems;

const styles = StyleSheet.create({
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    bottom: 0,
    backgroundColor: colors.ligtGreyBg,
  },
  problemList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  problemRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  subProblemContainer: {
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: colors.whiteBg,
    marginVertical: 10,
  },
  radioGroup: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});
