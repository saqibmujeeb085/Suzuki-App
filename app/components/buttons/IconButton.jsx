import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const IconButton = ({ icon, onPress, color = "#212121", children }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={styles.iconButtonContainer}>
        {icon && <MaterialCommunityIcons name={icon} size={13} color={color} />}

        <AppText color={color} fontSize={10}>
          {children}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  iconButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
