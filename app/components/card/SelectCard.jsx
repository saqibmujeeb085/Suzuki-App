import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import AppText from "../text/Text";
import { RadioGroup } from "react-native-radio-buttons-group";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppTextInput from "../formFields/TextInput";

const SelectCard = ({
  indicator,
  onValueChange,
  num,
  onImageSelected,
  onSelectedImageName,
  onRemoveImage,
  questionId,
  points,
  options,
  imgCondition = false,
  textCondition = false,
  pointsCondition = false,
  condition = false,
  textBox = false,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const handleValueChange = (id) => {
    const selectedOption = options.find((radio) => radio.id === id);
    const selectedValue = selectedOption.value;
    setSelectedId(id);
    setSelectedValue(selectedValue);
    onValueChange(selectedValue);
  };

  const handlePointsValueChange = (id) => {
    const selectedOption = points.find((radio) => radio.id === id);
    const selectedValue = selectedOption.value;
    setSelectedId(id);
    setSelectedValue(selectedValue);
    onValueChange(selectedValue);
  };

  const shouldShowImage =
    imgCondition &&
    (!condition ||
      (condition && selectedValue !== "good" && selectedValue !== ""));

  const shouldShowText =
    textCondition &&
    condition &&
    selectedValue !== "good" &&
    selectedValue !== "";

  const shouldShowPonits =
    pointsCondition &&
    points.length > 0 &&
    condition &&
    selectedValue !== "good" &&
    selectedValue !== "";

  return (
    <View style={styles.inspectionBox}>
      <AppText
        fontSize={mainStyles.h1FontSize}
        color={colors.fontBlack}
        fontFamily={mainStyles.appFontBold}
      >
        {num + 1}. {indicator}
      </AppText>
      <RadioGroup
        containerStyle={{
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
        radioButtons={options}
        onPress={handleValueChange}
        selectedId={selectedId}
      />
      {shouldShowImage && (
        <View>
          <InspectionImagePicker
            onImageSelected={(uri) => onImageSelected(questionId, uri)}
            onSelectedImageName={(name) =>
              onSelectedImageName(questionId, name)
            }
            onRemoveImage={() => onRemoveImage(questionId)}
          />
        </View>
      )}
      {shouldShowText && (
        <View style={{ paddingHorizontal: 12 }}>
          <AppTextInput
            inputMode={"textArea"}
            multiline
            numberOfLines={3}
            placeholder="Mention Reason"
            textAlignVertical={"top"}
          />
        </View>
      )}
      {shouldShowPonits && (
        <View
          style={{
            paddingHorizontal: 12,
            elevation: 2,
            borderRadius: 3,
            marginHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: colors.whiteBg,
          }}
        >
          <AppText marginBottom={10}>Select Type:</AppText>
          <RadioGroup
            containerStyle={{
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
            radioButtons={points}
            onPress={handlePointsValueChange}
            selectedId={selectedId}
          />
        </View>
      )}
    </View>
  );
};

export default SelectCard;

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    minHeight: 10,
    padding: 20,
    gap: 20,
  },
});
