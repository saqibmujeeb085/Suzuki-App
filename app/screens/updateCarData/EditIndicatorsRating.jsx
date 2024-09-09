import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppScreen from "../../components/screen/Screen";
import GradientButton from "../../components/buttons/GradientButton";
import InspectionHeader from "../../components/header/InspectionHeader";
import { colors } from "../../constants/colors";

const EditIndicatorsRating = ({ navigation }) => {
  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Edit Car Info
      </InspectionHeader>
      <View style={styles.formButton}>
        <GradientButton onPress={() => {}}>Save</GradientButton>
      </View>
    </AppScreen>
  );
};

export default EditIndicatorsRating;

const styles = StyleSheet.create({
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    bottom: 0,
    backgroundColor: colors.ligtGreyBg,
  },
});
