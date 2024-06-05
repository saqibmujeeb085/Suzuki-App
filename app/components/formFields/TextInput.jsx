import { TextInput, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";



const AppTextInput = ({ ...inputType }) => {
  return <TextInput {...inputType} style={styles.inputField} />;
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputField: {
    fontSize: mainStyles.h3FontSize.fontSize,
    color: colors.mediumGrey,
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    width: "100%",
    minHeight: 60,
  },
});
