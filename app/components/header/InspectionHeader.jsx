import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";

const InspectionHeader = ({ onPress, children }) => {
  return (
    <View style={styles.inspectionHeader}>
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <MaterialCommunityIcons name="arrow-left" size={15} color={"#000000"} />
      </TouchableOpacity>
      <AppText fontSize={mainStyles.h2FontSize}>{children}</AppText>
    </View>
  );
};

export default InspectionHeader;

const styles = StyleSheet.create({
  inspectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
});
