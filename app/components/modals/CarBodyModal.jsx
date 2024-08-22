import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import AppText from "../text/Text";
import GradientButton from "../buttons/GradientButton";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import Checkbox from "expo-checkbox";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";

const CarBodyModal = ({ show = false, setShow }) => {
  const [isColorChecked, setColorChecked] = useState(false);
  const [isScratchChecked, setScratchChecked] = useState(false);
  const [isDentChecked, setDentChecked] = useState(false);
  return (
    <Modal transparent visible={show}>
      <TouchableWithoutFeedback
        onPress={() => setShow(!show)}
        style={{ flex: 1 }}
      >
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
            <View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onValueChange={setColorChecked}
                    color={isColorChecked ? colors.purple : undefined}
                    value={isColorChecked}
                  />
                  <AppText>Color</AppText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onValueChange={setDentChecked}
                    color={isDentChecked ? colors.purple : undefined}
                    value={isDentChecked}
                  />
                  <AppText>Dent</AppText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onValueChange={setScratchChecked}
                    color={isScratchChecked ? colors.purple : undefined}
                    value={isScratchChecked}
                  />
                  <AppText>Scratch</AppText>
                </View>
              </View>
            </View>

            <InspectionImagePicker
              onImageSelected={(uri) => onImageSelected(questionId, uri)}
              onSelectedImageName={(name) =>
                onSelectedImageName(questionId, name)
              }
              onRemoveImage={() => onRemoveImage(questionId)}
            />

            <View style={styles.modalButtons}>
              <GradientButton size={10} onPress={""}>
                Save
              </GradientButton>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  Inputs: {
    marginTop: 10,
    gap: 10,
  },
  DatePickers: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  datePickerContainer: {
    flex: 1,
  },
  datePickerButton: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
  },
});
