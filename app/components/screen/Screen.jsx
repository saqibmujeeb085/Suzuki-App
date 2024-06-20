import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import React from "react";
import Constants from "expo-constants";

const AppScreen = ({ backgroundColor = "#F1F1F1", children }) => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : Constants.statusBarHeight;

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor, paddingTop: statusBarHeight }]}>
      {children}
    </SafeAreaView>
  );
};

export default AppScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});
