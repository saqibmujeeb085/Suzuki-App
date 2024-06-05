import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";

const DeleteButton = ({ size = 15, children, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={styles.Button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* <View > */}

      {children}

      {/* </View> */}
    </TouchableOpacity>
  );
};

export default DeleteButton;

const styles = StyleSheet.create({
  Button: {
    shadowColor: "#00000050",
    backgroundColor: "00000000",
    elevation: 10,
    borderWidth: 0,
    paddingVertical: 18,
    borderRadius: 5,
    paddingHorizontal: 18,
    alignItems: "center",
    borderColor: colors.fontRed,
    borderWidth: 1,
  },
});
