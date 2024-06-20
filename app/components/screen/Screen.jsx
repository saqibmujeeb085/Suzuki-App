import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppScreen = ({ backgroundColor = "#F1F1F1", children }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        styles.screenContainer,
        {
          backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
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
