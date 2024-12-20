import { Modal, StyleSheet, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GradientButton from "../buttons/GradientButton";
import { TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";

const ProcessModal = ({
  heading,
  headingSize = mainStyles.h3FontSize,
  text,
  pbtn,
  pbtnPress,
  sbtn,
  sbtnColor = colors.fontGrey,
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
                size={20}
                color={colors.fontWhite}
                onPress={() => setShow(!show)}
              />
            )}
          </View>
          <View style={styles.modalContent}>
            {heading && (
              <AppText
                fontSize={headingSize}
                color={colors.fontBlack}
                textAlign={"center"}
              >
                {heading}
              </AppText>
            )}
            {text && (
              <AppText
                fontSize={mainStyles.h3FontSize}
                color={colors.fontBlack}
                textAlign={"center"}
              >
                {text}
              </AppText>
            )}
          </View>
          <View style={styles.modalButtons}>
            <GradientButton size={mainStyles.h3FontSize} onPress={pbtnPress}>
              {pbtn}
            </GradientButton>
            <TouchableOpacity onPress={sbtnPress}>
              <AppText
                textAlign={"center"}
                color={sbtnColor}
                fontSize={mainStyles.h2FontSize}
              >
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
    width: 300,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 30,
    paddingVertical: 35,
    gap: 15,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: -12,
    right: -12,
    borderRadius: 40,
    height: 30,
    width: 30,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    gap: 5,
  },
  modalButtons: {
    marginTop: 0,
    gap: 15,
    height: 80,
  },
});
