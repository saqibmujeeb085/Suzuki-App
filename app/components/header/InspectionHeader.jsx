import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const InspectionHeader = ({ rightOnpress, rightText, onPress, children }) => {
  return (
    <View style={styles.inspectionHeader}>
      <TouchableOpacity
        style={styles.left}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          color={colors.fontBlack}
        />
      </TouchableOpacity>
      <AppText
        fontSize={mainStyles.pageHeadingFont}
        fontFamily={mainStyles.appFontBold}
        color={colors.purple}
        width="250"
        textAlign={"center"}
      >
        {children}
      </AppText>
      <TouchableOpacity
        style={styles.right}
        activeOpacity={0.6}
        onPress={rightOnpress}
      >
        <AppText color={colors.fontBlack} fontSize={mainStyles.h2FontSize}>
          {rightText}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default InspectionHeader;

const styles = StyleSheet.create({
  inspectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    width: "100%",
  },
  left: {
    position: "absolute",
    left: 20,
    top: 35,
  },
  right: {
    position: "absolute",
    right: 20,
    top: 35,
  },
});
