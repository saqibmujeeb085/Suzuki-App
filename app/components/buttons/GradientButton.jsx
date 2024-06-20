import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";

const GradientButton = ({
  size = mainStyles.h2FontSize,
  children,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.ButtonContainer}
      onPress={!disabled ? onPress : null}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={[
          colors.buttonGradient1,
          colors.buttonGradient2,
          colors.buttonGradient3,
        ]}
        start={[0, 0]}
        end={[0.6, 1]}
        style={[styles.gredientButton, { opacity: !disabled ? 1 : 0.8 }]}
      >
        <AppText color={colors.fontWhite} fontSize={size}>
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
