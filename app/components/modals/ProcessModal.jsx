import { Modal, StyleSheet, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GradientButton from "../buttons/GradientButton";
import { TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";

const ProcessModal = ({
  heading,
  headingSize = 12,
  text,
  pbtn,
  pbtnPress,
  sbtn,
  sbtnColor = "#BBBBBB",
  sbtnPress,
  icon,
  show,
  setShow,
}) => {
  return (
    <Modal transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={styles.closeButton}>
            {icon && (
              <MaterialCommunityIcons
                name="close"
                size={14}
                color={"#1D1D1D"}
                onPress={() => setShow(!show)}
              />
            )}
          </View>
          <View style={styles.modalContent}>
            <AppText
              fontSize={headingSize}
              color={"#1D1D1D"}
              textAlign={"center"}
            >
              {heading}
            </AppText>
            <AppText fontSize={10} color={"#1D1D1D"} textAlign={"center"}>
              {text}
            </AppText>
          </View>
          <View style={styles.modalButtons}>
            <GradientButton size={10} onPress={pbtnPress}>
              {pbtn}
            </GradientButton>
            <TouchableOpacity onPress={sbtnPress}>
              <AppText textAlign={"center"} color={sbtnColor} fontSize={12}>
                {sbtn}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProcessModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000060",
  },
  modalBox: {
    width: 280,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 30,
    paddingVertical: 35,
    gap: 15,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 40,
    height: 25,
    width: 25,
    backgroundColor: "#BBBBBB",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    gap: 5,
  },
  modalButtons: {
    marginTop: 15,
    gap: 15,
    height: 80,
  },
});
