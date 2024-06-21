import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const InspectionHeader = ({
  backIcon = true,
  borderBottom = true,
  rightOnpress,
  rightText,
  onPress,
  children,
}) => {
  return (
    <View
      style={[
        styles.inspectionHeader,
        {
          marginBottom: borderBottom ? 20 : 0,
          borderBottomWidth: borderBottom ? 1 : 0,
        },
      ]}
    >
      {backIcon && (
        <TouchableOpacity
          style={styles.left}
          activeOpacity={0.6}
          onPress={onPress}
        >
          <AntDesign name="arrowleft" size={24} color={colors.fontBlack} />
        </TouchableOpacity>
      )}
      <AppText
        fontSize={mainStyles.pageHeadingFont}
        fontFamily={mainStyles.appFontBold}
        color={colors.fontBlack}
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
    paddingHorizental: 20,
    flex: 1,
    maxHeight: 75,
    minHeight: 75,
    borderColor: "#E3E3E3",
    marginHorizontal: 20,
  },
  left: {
    position: "absolute",
    left: 0,
    top: 25,
  },
  right: {
    position: "absolute",
    right: 0,
    top: 25,
  },
});
