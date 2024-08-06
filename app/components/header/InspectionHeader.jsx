import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";

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
          paddingHorizontal: borderBottom ? 0 : 20,
          marginLeft: borderBottom ? -20 : 0,
          marginRight: borderBottom ? -20 : 0,
        },
      ]}
    >
      <LinearGradient
        colors={
          borderBottom
            ? [
                colors.buttonGradient1,
                colors.buttonGradient2,
                colors.buttonGradient3,
              ]
            : [colors.ligtGreyBg, colors.ligtGreyBg]
        }
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        {backIcon && (
          <TouchableOpacity
            style={styles.left}
            activeOpacity={0.6}
            onPress={onPress}
          >
            <AntDesign
              name="arrowleft"
              size={24}
              color={borderBottom ? colors.fontWhite : colors.fontBlack}
            />
          </TouchableOpacity>
        )}
        <AppText
          fontSize={mainStyles.pageHeadingFont}
          fontFamily={mainStyles.appFontBold}
          color={borderBottom ? colors.fontWhite : colors.fontBlack}
          width="250"
          textAlign={"center"}
          ellipsizeMode={"tail"}
          numberOfLines={1}
          marginHorizontal={20}
        >
          {children}
        </AppText>
        <TouchableOpacity
          style={styles.right}
          activeOpacity={0.6}
          onPress={rightOnpress}
        >
          <AppText
            color={borderBottom ? colors.fontWhite : colors.fontBlack}
            fontSize={mainStyles.h2FontSize}
          >
            {rightText}
          </AppText>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default InspectionHeader;

const styles = StyleSheet.create({
  inspectionHeader: {
    flex: 1,
    maxHeight: 60,
    minHeight: 60,
    borderColor: "#E3E3E3",
    marginHorizontal: 20,
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    position: "absolute",
    left: 30,
    top: 18,
  },
  right: {
    position: "absolute",
    right: 30,
    top: 20,
  },
});
