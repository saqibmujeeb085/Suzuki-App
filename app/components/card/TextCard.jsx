import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import AppText from "../text/Text";
import { RadioGroup } from "react-native-radio-buttons-group";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";

const TextCard = () => {
  const handleValueChange = (id) => {
    const selectedValue = radioButtons.find((radio) => radio.id === id).value;
    setSelectedId(id);
    onValueChange(selectedValue);
  };

  return <View style={styles.inspectionBox}></View>;
};

export default TextCard;

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    minHeight: 10,
    padding: 20,
    gap: 20,
  },
});
