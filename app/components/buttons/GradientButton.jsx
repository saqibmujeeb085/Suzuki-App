import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../text/Text";

const GradientButton = ({ size = 15, children, onPress, disabled }) => {
  return (
    <TouchableOpacity
      styles={styles.ButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["#003790", "#0044B2", "#0050d1"]}
        start={[0, 0]}
        end={[0.6, 1]}
        style={styles.gredientButton}
      >
        <AppText color={"white"} fontSize={size}>
          {children}
        </AppText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  ButtonContainer: {
    width: "100%",
  },
  gredientButton: {
    shadowColor: "#00000050",
    elevation: 10,
    borderWidth: 0,
    paddingVertical: 20,
    borderRadius: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
});
