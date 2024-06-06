import { Text } from "react-native";
import React from "react";
import { mainStyles } from "../../constants/style";

function AppText({
  width,
  textAlign,
  fontSize,
  fontFamily = mainStyles.appFontRegular,
  numberOfLines,
  ellipsizeMode,
  children,
  ...styles
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={{
        fontFamily: fontFamily,
        textAlign: textAlign,
        maxWidth: width,
        fontSize: fontSize,
        ...styles,
      }}
    >
      {children}
    </Text>
  );
}

export default AppText;
