import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppText from "../text/Text";
import { MaterialIcons } from "@expo/vector-icons";

const PasswordInput = ({ Error, placeholder, val, ...inputType }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const [clicked, setClicked] = useState(false);

  return (
    <View style={styles.textFieldBox}>
      <View style={styles.inputContainer}>
        <TextInput
          {...inputType}
          style={styles.inputField}
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor={colors.fontGrey}
          onFocus={() => setClicked(true)}
          onBlur={() => setClicked(false)}
        />
        <AppText
          color={colors.fontGrey}
          position={"absolute"}
          top={clicked || val ? -8 : 20}
          left={20}
          fontSize={
            clicked || val ? mainStyles.h3FontSize : mainStyles.h2FontSize
          }
          backgroundColor={clicked || val ? colors.ligtGreyBg : "transparent"}
          zIndex={0}
          paddingHorizontal={5}
          paddingVertical={2}
        >
          {placeholder}
        </AppText>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
        >
          <MaterialIcons
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            size={24}
            color={isPasswordVisible ? colors.fontBlack : colors.fontGrey}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordInput;

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
    position: "relative",
    zIndex: 10,
  },
  textFieldBox: {
    gap: 5,
    minWidth: "48.5%",
    flex: 1,
    position: "relative",
    zIndex: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.fontGrey,
  },
  iconContainer: {
    position: "absolute",
    right: 20,
    zIndex: 20,
    padding: 10,
  },
});
