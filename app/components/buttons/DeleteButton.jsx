import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";

const DeleteButton = ({ children, onPress }) => {
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
    backgroundColor: "#F1F1F1" ,
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
