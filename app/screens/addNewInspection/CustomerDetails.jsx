import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import AppTextInput from "../../components/formFields/TextInput";
import GradientButton from "../../components/buttons/GradientButton";

const CustomerDetails = ({ navigation }) => {
  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Customer Details
      </InspectionHeader>
      <View style={styles.InspectionformContainer}>
        <AppTextInput placeholder="Customer Name" />
        <AppTextInput placeholder="Cell Number" />
        <AppTextInput placeholder="Email Address" />
        <View style={styles.formButton}>
          <GradientButton onPress={() => navigation.navigate("CarDetails")}>
            Next
          </GradientButton>
        </View>
      </View>
    </AppScreen>
  );
};

export default CustomerDetails;

const styles = StyleSheet.create({
  InspectionformContainer: {
    gap: 10,
    paddingHorizontal: 20,
  },
  formButton: {
    marginTop: 10,
  },
});
