import { TextInput, StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppText from "../text/Text";

const AppTextInput = ({ Error, inputMode, ...inputType }) => {
  return (
    <View style={styles.textFieldBox}>
      <TextInput
        {...inputType}
        inputMode={inputMode}
        style={styles.inputField}
      />
      {Error && (
        <AppText
          fontSize={mainStyles.h2FontSize}
          color={colors.fontRed}
          marginLeft={10}
          marginRight={10}
          marginBottom={5}
        >
          {Error}
        </AppText>
      )}
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputField: {
    fontSize: mainStyles.h3FontSize.fontSize,
    color: colors.fontGrey,
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
  },
});
