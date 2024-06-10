import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const InspectionBoardCard = ({ name, onPress }) => {
  return (
    <TouchableWithoutFeedback style={{ marginBottom: 10 }} onPress={onPress}>
      <View style={styles.inscpectionCard}>
        <View style={styles.inpsectionContent}>
          <MaterialCommunityIcons
            name="car-clutch"
            color={"#1d1d1d"}
            size={20}
          />
          <View style={styles.inpectionContentText}>
            <AppText color={"#1d1d1d"} fontSize={10}>
              {name}
            </AppText>
            <AppText color={"#BBBBBB"} fontSize={8}>
              Click to Edit
            </AppText>
          </View>
        </View>
        <View style={styles.inpsectionRating}>
          <AppText color={"#BBBBBB"} fontSize={8} textAlign={"right"}>
            Overall Rating
          </AppText>
          <AppText color={"#212121"} fontSize={14} textAlign={"right"}>
            0.0/10
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
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    elevation: 2,
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
