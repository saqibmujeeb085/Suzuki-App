import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const InspectionBoardCard = ({ name, onPress, Rating, inspectionIsDone }) => {
  return (
    <TouchableWithoutFeedback
      style={{ marginBottom: 10 }}
      onPress={!inspectionIsDone ? onPress : null}
    >
      <View
        style={[
          styles.inscpectionCard,
          inspectionIsDone && styles.inspectionNotDoneCard,
        ]}
      >
        <View style={styles.inpsectionContent}>
          <MaterialCommunityIcons
            name="car-clutch"
            color={colors.fontBlack}
            size={20}
          />
          <View style={styles.inpectionContentText}>
            <AppText color={colors.fontBlack} fontSize={mainStyles.h3FontSize}>
              {name}
            </AppText>
            <AppText color={colors.fontGrey} fontSize={mainStyles.h4FontSize}>
              {!inspectionIsDone ? "Click to Edit" : "Rating Is Done"}
            </AppText>
          </View>
        </View>
        <View style={styles.inpsectionRating}>
          <AppText
            color={colors.fontGrey}
            fontSize={mainStyles.h4FontSize}
            textAlign={"right"}
          >
            Overall Rating
          </AppText>
          <AppText
            color={colors.fontBlack}
            fontSize={mainStyles.h2FontSize}
            textAlign={"right"}
          >
            {Rating ? Rating : "NaN"} / 10
          </AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InspectionBoardCard;

const styles = StyleSheet.create({
  inscpectionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    padding: 20,
    elevation: 2,
  },
  inspectionNotDoneCard: {
    backgroundColor: colors.ligtGreyBg,
  },
  inpsectionContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  inpectionContentText: {
    gap: 5,
  },
  inpsectionRating: {
    gap: 5,
  },
});
