import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";

const PdfView = ({ navigation, route }) => {
  const { link } = route.params || {};
  const googleDocsUrl = `https://docs.google.com/viewer?url=${link}&embedded=true`;
  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Viewing PDF
      </InspectionHeader>
    </AppScreen>
  );
};

export default PdfView;

const styles = StyleSheet.create({});
