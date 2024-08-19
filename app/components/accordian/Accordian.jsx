import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";

const Accordion = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <View style={styles.accordionContainer}>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.header}
        >
          <AppText
            fontFamily={mainStyles.appFontBold}
            fontSize={mainStyles.h2FontSize}
          >
            {title}
          </AppText>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      {expanded && <View style={styles.content}>{children}</View>}
    </>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 1,
    overflow: "hidden",
    backgroundColor: colors.whiteBg,
    minHeight: 60,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  content: {
    padding: 10,
  },
});

export default Accordion;
