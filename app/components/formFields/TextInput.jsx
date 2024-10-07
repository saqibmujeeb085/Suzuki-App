import { TextInput, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppText from "../text/Text";

const AppTextInput = ({ Error, inputMode, placeholder, ...inputType }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <View style={styles.textFieldBox}>
      <TextInput
        {...inputType}
        inputMode={inputMode}
        style={styles.inputField}
        placeholderTextColor={colors.fontGrey}
        onFocus={() => setClicked(true)} // Use onFocus to set clicked to true
        onBlur={() => setClicked(false)} // Use onBlur to set clicked to false
      />
      <AppText
        color={colors.fontGrey}
        position={"absolute"}
        top={!clicked ? 20 : 2}
        left={20}
        fontSize={!clicked ? mainStyles.h2FontSize : mainStyles.h3FontSize}
      >
        {placeholder}
      </AppText>
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputField: {
    fontSize: mainStyles.h3FontSize,
    color: colors.fontBlack,
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    elevation: 2,
    flex: 1,
    width: "100%",
    minHeight: 60,
  },
  textFieldBox: {
    gap: 5,
    minWidth: "48.5%",
    flex: 1,
    position: "relative",
  },
});
