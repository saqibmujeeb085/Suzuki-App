import React, { useState, useEffect } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import AppText from "../text/Text";
import GradientButton from "../buttons/GradientButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import Checkbox from "expo-checkbox";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import RadioGroup from "react-native-radio-buttons-group";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CarBodyModal = ({
  show = false,
  setShow,
  activeProblem,
  tempID,
  onSave,
}) => {
  const [problems, setProblems] = useState({
    repaint: {
      checked: false,
      selectedId: null,
      selectedValue: null,
      image: null,
      imageName: null,
      imageType: null,
    },
    Dent: {
      checked: false,
      selectedId: null,
      selectedValue: null,
      image: null,
      imageName: null,
      imageType: null,
    },
    Scratch: {
      checked: false,
      selectedId: null,
      selectedValue: null,
      image: null,
      imageName: null,
      imageType: null,
    },
    PanelReplaced: {
      checked: false,
      image: null,
      imageName: null,
      imageType: null,
    },
  });

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const points = {
    repaint: [
      {
        id: "1",
        label: "Painted",
        value: "Painted",
        color: colors.purple,
      },
      {
        id: "2",
        label: "Minor Paint",
        value: "Minor Paint",
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

  useEffect(() => {
    // Ensure all checked problems have both a selectedValue (if applicable) and an image
    const areAllValid = Object.values(problems).every(
      (problem) =>
        !problem.checked ||
        ((problem.selectedValue || problem.selectedValue === null) &&
          problem.image)
    );
    setIsSaveDisabled(!areAllValid);
  }, [problems]);

  const handleProblemToggle = (problem) => {
    setProblems((prev) => ({
      ...prev,
      [problem]: {
        ...prev[problem],
        checked: !prev[problem].checked,
        selectedId: null,
        selectedValue:
          problem === "PanelReplaced"
            ? prev[problem].checked
              ? null
              : "Panel Replaced"
            : null,
        image: null,
        imageName: null,
        imageType: null,
      },
    }));
  };

  const handleSubProblemSelect = (problem, selectedId) => {
    const selectedOption = points[problem]?.find(
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

  const handleImageUriSelect = (problem, uri) => {
    setProblems((prev) => ({
      ...prev,
      [problem]: {
        ...prev[problem],
        image: uri,
        imageType: "image/jpeg", // Explicitly adding image type
      },
    }));
  };

  const handleImageNameSelect = (problem, name) => {
    setProblems((prev) => ({
      ...prev,
      [problem]: {
        ...prev[problem],
        imageName: name,
      },
    }));
  };

  console.log(problems);

  const handleSave = async () => {
    setLoading(true);

    // Save only checked problems with their corresponding radio value and image
    const filteredProblems = Object.keys(problems)
      .filter((problem) => problems[problem].checked) // Only include checked problems
      .map((problem) => ({
        problemName: problem,
        selectedValue: problems[problem].selectedValue,
        image: problems[problem].image
          ? {
              uri: problems[problem].image,
              name: problems[problem].imageName,
              type: problems[problem].imageType, // Include the image type
            }
          : undefined,
      }));

    const dataToSave = {
      tempID: `${tempID}`,
      problemLocation: activeProblem,
      problems: filteredProblems, // Only save filtered (checked) problems
    };

    console.log("data to save", dataToSave);

    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");
      const existingData = storedData ? JSON.parse(storedData) : [];
      const updatedData = [...existingData, dataToSave];
      await AsyncStorage.setItem(
        "@carBodyQuestionsdata",
        JSON.stringify(updatedData)
      );

      setLoading(false);
      resetFields();
      setShow(false);
      if (onSave) {
        onSave(); // Call the onSave callback after successful save
      }
    } catch (error) {
      console.error("Error saving questions values:", error);
      setLoading(false);
    }
  };

  const resetFields = () => {
    setProblems({
      repaint: {
        checked: false,
        selectedId: null,
        selectedValue: null,
        image: null,
        imageName: null,
        imageType: null,
      },
      Dent: {
        checked: false,
        selectedId: null,
        selectedValue: null,
        image: null,
        imageName: null,
        imageType: null,
      },
      Scratch: {
        checked: false,
        selectedId: null,
        selectedValue: null,
        image: null,
        imageName: null,
        imageType: null,
      },
      PanelReplaced: {
        checked: false,
        image: null,
        imageName: null,
        imageType: null,
      },
    });
  };

  return (
    <Modal transparent visible={show}>
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={colors.fontWhite}
              onPress={() => {
                resetFields();
                setShow(false);
              }}
            />
          </View>

          <View style={styles.FiltersInputs}>
            <View style={styles.Content}>
              <AppText fontSize={mainStyles.h2FontSize}>
                {activeProblem}
              </AppText>
              <AppText
                fontSize={mainStyles.h3FontSize}
                textAlign={"center"}
                marginBottom={10}
              >
                Select the Problems in the Area.
              </AppText>
            </View>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            <View style={styles.problemList}>
              {Object.keys(points).map((problem) => (
                <View key={problem}>
                  <View style={styles.problemRow}>
                    <Checkbox
                      onValueChange={() => handleProblemToggle(problem)}
                      color={
                        problems[problem].checked ? colors.purple : undefined
                      }
                      value={problems[problem].checked}
                      style={{ padding: 10 }}
                    />
                    <AppText fontSize={mainStyles.h2FontSize}>
                      {problem.charAt(0).toUpperCase() + problem.slice(1)}
                    </AppText>
                  </View>
                  {problems[problem].checked && (
                    <>
                      <View style={styles.subProblemContainer}>
                        <RadioGroup
                          containerStyle={styles.radioGroup}
                          radioButtons={points[problem]}
                          onPress={(selectedId) =>
                            handleSubProblemSelect(problem, selectedId)
                          }
                          selectedId={problems[problem].selectedId}
                        />
                        <InspectionImagePicker
                          onImageSelected={(uri) =>
                            handleImageUriSelect(problem, uri)
                          }
                          onSelectedImageName={(name) =>
                            handleImageNameSelect(problem, name)
                          }
                          onRemoveImage={() =>
                            handleImageUriSelect(problem, null)
                          }
                        />
                      </View>
                    </>
                  )}
                </View>
              ))}

              {/* Panel Replaced Section */}
              <View>
                <View style={styles.problemRow}>
                  <Checkbox
                    onValueChange={() => handleProblemToggle("PanelReplaced")}
                    color={
                      problems.PanelReplaced.checked ? colors.purple : undefined
                    }
                    value={problems.PanelReplaced.checked}
                    style={{ padding: 10 }}
                  />
                  <AppText fontSize={mainStyles.h2FontSize}>
                    Panel Replaced
                  </AppText>
                </View>
                {problems.PanelReplaced.checked && (
                  <View style={styles.subProblemContainer}>
                    {/* No radio buttons, only image upload */}
                    <InspectionImagePicker
                      onImageSelected={(uri) =>
                        handleImageUriSelect("PanelReplaced", uri)
                      }
                      onSelectedImageName={(name) =>
                        handleImageNameSelect("PanelReplaced", name)
                      }
                      onRemoveImage={() =>
                        handleImageUriSelect("PanelReplaced", null)
                      }
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <GradientButton
              size={15}
              onPress={handleSave}
              disabled={isSaveDisabled}
            >
              {loading ? "Loading..." : "Save"}
            </GradientButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CarBodyModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000060",
  },
  modalBox: {
    width: 300,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 20,
    paddingVertical: 35,
    gap: 15,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: -12,
    right: -12,
    borderRadius: 100,
    height: 30,
    width: 30,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtons: {
    marginTop: 15,
    gap: 15,
    height: 50,
  },
  Content: {
    gap: 5,
    alignItems: "center",
  },
  problemList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  problemRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
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
