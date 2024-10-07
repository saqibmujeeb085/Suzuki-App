import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppText from "../text/Text";
import { MaterialIcons } from "@expo/vector-icons";

const PasswordInput = ({ Error, ...inputType }) => {
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
          top={!clicked ? 20 : 2}
          left={20}
          fontSize={!clicked ? mainStyles.h2FontSize : mainStyles.h3FontSize}
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
    fontSize: mainStyles.h3FontSize.fontSize,
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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 20,
  },
});
