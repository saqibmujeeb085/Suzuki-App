import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import AppText from "../text/Text";
import GradientButton from "../buttons/GradientButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import Checkbox from "expo-checkbox";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import RadioGroup from "react-native-radio-buttons-group";

const CarBodyModal = ({ show = false, setShow }) => {
  const [problems, setProblems] = useState({
    color: { checked: false, selectedId: null, selectedValue: null },
    dent: { checked: false, selectedId: null, selectedValue: null },
    scratch: { checked: false, selectedId: null, selectedValue: null },
  });

  const points = {
    color: [
      { id: "1", label: "Major", value: "Major", color: colors.purple },
      { id: "2", label: "Minor", value: "Minor", color: colors.purple },
    ],
    dent: [
      { id: "3", label: "Deep", value: "Deep", color: colors.purple },
      { id: "4", label: "Shallow", value: "Shallow", color: colors.purple },
    ],
    scratch: [
      { id: "5", label: "Long", value: "Long", color: colors.purple },
      { id: "6", label: "Short", value: "Short", color: colors.purple },
    ],
  };

  const handleProblemToggle = (problem) => {
    setProblems((prev) => ({
      ...prev,
      [problem]: {
        ...prev[problem],
        checked: !prev[problem].checked,
        selectedId: prev[problem].checked ? null : prev[problem].selectedId,
        selectedValue: prev[problem].checked
          ? null
          : prev[problem].selectedValue,
      },
    }));
  };

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

  const handleSave = () => {
    console.log("Selected Problems: ", problems);
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
              onPress={() => setShow(!show)}
            />
          </View>

          <View style={styles.FiltersInputs}>
            <View style={styles.Content}>
              <AppText fontSize={mainStyles.h2FontSize}>
                Describe Problem
              </AppText>
              <AppText fontSize={mainStyles.h3FontSize}>
                Select the Problems in the Car Body
              </AppText>
            </View>
          </View>

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
                  />
                  <AppText>
                    {problem.charAt(0).toUpperCase() + problem.slice(1)}
                  </AppText>
                </View>
                {problems[problem].checked && (
                  <View
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      elevation: 2,
                      backgroundColor: colors.whiteBg,
                      marginVertical: 10,
                    }}
                  >
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

          <InspectionImagePicker
            onImageSelected={(uri) => console.log("Image selected: ", uri)}
            onSelectedImageName={(name) =>
              console.log("Selected Image Name: ", name)
            }
            onRemoveImage={() => console.log("Image removed")}
          />

          <View style={styles.modalButtons}>
            <GradientButton size={15} onPress={handleSave}>
              Save
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
  },
  radioGroup: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
