import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../components/text/Text";
import { mainStyles } from "../constants/style";

const NewInspectionButton = ({ onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.ButtonContainer}>
        <LinearGradient
          colors={["#003790", "#0044B2", "#0050d1"]}
          start={[0, 0]}
          end={[0.6, 1]}
          style={styles.gredientButton}
        >
          <AppText color={"white"} fontSize={mainStyles.h2FontSize}>
            Start
          </AppText>
          <AppText color={"white"} fontSize={mainStyles.h2FontSize}>
            New
          </AppText>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewInspectionButton;

const styles = StyleSheet.create({
  ButtonContainer: {
    borderRadius: 100,
    borderRadius: 40,
    height: 65,
    width: 65,
    overflow: "hidden",
    bottom: 20,
    elevation: 10,
  },
  gredientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
