import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";

const GradientButton = ({ size = 14, children, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={styles.ButtonContainer}
      onPress={!disabled ? onPress : null}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={
          disabled
            ? [colors.buttonBgColor, colors.buttonBgColor]
            : [
                colors.buttonGradient1,
                colors.buttonGradient2,
                colors.buttonGradient3,
              ]
        }
        start={[0, 0]}
        end={[0.6, 1]}
        style={styles.gredientButton}
      >
        <AppText
          color={disabled ? colors.buttonFontColor : colors.fontWhite}
          fontSize={size}
        >
          {children}
        </AppText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  ButtonContainer: {
    flex: 1,
    minHeight: 60,
  },
  gredientButton: {
    shadowColor: "#000000",
    elevation: 10,
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    height: 60,
  },
});
