import { TextInput, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppText from "../text/Text";

const AppTextInput = ({
  Error,
  inputMode,
  placeholder,
  val,
  bgColor = colors.ligtGreyBg,
  ...inputType
}) => {
  const [clicked, setClicked] = useState(false);

  console.log(val);

  return (
    <View style={styles.textFieldBox}>
      <View
        style={{
          // backgroundColor: colors.whiteBg,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colors.fontGrey,
        }}
      >
        <AppText
          color={colors.fontGrey}
          position={"absolute"}
          top={clicked || val ? -8 : 20}
          left={20}
          fontSize={
            clicked || val ? mainStyles.h3FontSize : mainStyles.h2FontSize
          }
          backgroundColor={clicked || val ? bgColor : "transparent"}
          zIndex={0}
          paddingHorizontal={5}
          paddingVertical={2}
        >
          {placeholder}
        </AppText>
        <TextInput
          {...inputType}
          inputMode={inputMode}
          style={styles.inputField}
          onFocus={() => setClicked(true)}
          onBlur={() => setClicked(false)}
        />
      </View>
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputField: {
    fontSize: mainStyles.h3FontSize,
    color: colors.fontBlack,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    flex: 1,
    width: "100%",
    height: 60,
  },
  textFieldBox: {
    gap: 5,
    minWidth: "48.5%",
    flex: 1,
    position: "relative",
    zIndex: 5,
  },
});
