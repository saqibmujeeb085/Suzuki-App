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
  img,
  imgCondition = false,
  textCondition = false,
  pointsCondition = false,
  condition = false,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
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
    setSelectedSubId(id);
    setSelectedValue(selectedValue);
    onValueChange(selectedValue);
  };

  const shouldShowImage =
    img &&
    (!imgCondition ||
      (imgCondition &&
        selectedValue !== "good" &&
        selectedValue !== "not-applicable" &&
        selectedValue !== ""));

  const shouldShowText =
    textCondition &&
    condition &&
    selectedValue !== "good" &&
    selectedValue !== "not-applicable" &&
    selectedValue !== "";

  const shouldShowPonits =
    pointsCondition &&
    condition &&
    selectedValue !== "good" &&
    selectedValue !== "not-applicable" &&
    selectedValue !== "";

  return (
    <View style={styles.inspectionBox}>
      <AppText
        fontSize={mainStyles.h1FontSize}
        color={colors.fontBlack}
        fontFamily={mainStyles.appFontBold}
      >
        {num}. {indicator}
      </AppText>
      <RadioGroup
        containerStyle={{
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
        radioButtons={options}
        onPress={handleValueChange}
        selectedId={selectedId}
      />

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
            selectedId={selectedSubId}
          />
        </View>
      )}
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
