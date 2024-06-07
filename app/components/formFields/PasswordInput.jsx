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

  return (
    <View style={styles.textFieldBox}>
      <View style={styles.inputContainer}>
        <TextInput
          {...inputType}
          style={styles.inputField}
          secureTextEntry={!isPasswordVisible}
        />
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

export default PasswordInput;

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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    right: 20,
  },
});
