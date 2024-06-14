import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import Feather from "react-native-vector-icons/Feather";

const InspectionRatingCard = ({ category, indicators }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.InspectionRadtings}>
      <View style={styles.accordionContainer}>
        <TouchableOpacity onPress={toggleExpanded}>
          <View style={styles.accordionHeader}>
            <AppText>{category}</AppText>
            <Feather
              name={expanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.accordionContent}>
            {indicators.map((item) => (
              <View key={item?.id} style={styles.infoContainer}>
                <AppText
                  minWidth={150}
                  maxWidth={150}
                  fontSize={mainStyles.h3FontSize}
                >
                  {item?.indicators}
                </AppText>
                <View style={styles.line} />
                {item.data.map((dataItem) => (
                  <View
                    key={dataItem.insID}
                    minWidth={150}
                    maxWidth={150}
                    style={styles.dataContainer}
                  >
                    <AppText
                      fontSize={mainStyles.h3FontSize}
                      textAlign={"right"}
                    >
                      {dataItem.value === "true"
                        ? "Yes"
                        : dataItem.value === "false"
                        ? "No"
                        : dataItem.value}
                    </AppText>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default InspectionRatingCard;

const styles = StyleSheet.create({
  accordionContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
  },
  line: {
    height: 20,
    width: 0.5,
    backgroundColor: colors.fontGrey,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  accordionContent: {
    padding: 20,
    gap: 7,
  },
  contentBox: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    borderWidth: 1,
  },
  infoContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    justifyContent: "space-between",
    borderRadius: 5,
    borderColor: colors.ligtGreyBg,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: colors.whiteBg,
    gap: 5,
  },
  InspectionRadtings: {
    gap: 10,
  },
});
