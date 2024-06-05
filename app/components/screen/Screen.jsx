import { SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import Constants from "expo-constants";

const AppScreen = ({ backgroundColor = "#F1F1F1", children }) => {
  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor }]}>
      {children}
    </SafeAreaView>
  );
};

export default AppScreen;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
});
