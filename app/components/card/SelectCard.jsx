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
  onPointsValueChange,
  onReasonValueChange, // Add this prop
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
  error,
}) => {
  console.log(error);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const [conditionValue, setConditionValue] = useState("");
  const [reasonValue, setReasonValue] = useState(""); // Add state for reasonValue

  const handleValueChange = (id) => {
    const selectedOption = options.find((radio) => radio.id === id);
    const selectedValue = selectedOption.label;
    const selectedCondition = selectedOption.value;
    setSelectedId(id);
    setConditionValue(selectedCondition);
    setSelectedValue(selectedValue);
    onValueChange(selectedValue);
  };

  const handlePointsValueChange = (id) => {
    const selectedOption = points.find((radio) => radio.id === id);
    const selectedValue = selectedOption.value;
    setSelectedSubId(id);
    onPointsValueChange(selectedValue); // Pass the new value directly
    console.log(selectedValue); // This will now correctly log the selected value
  };

  const handleReasonValueChange = (text) => {
    setReasonValue(text);
    onReasonValueChange(text); // Call the prop function with the text value
  };

  const shouldShowImage =
    img &&
    (!imgCondition ||
      (imgCondition &&
        conditionValue !== "good" &&
        conditionValue !== "not-applicable" &&
        selectedValue !== ""));

  const shouldShowText =
    textCondition &&
    condition &&
    conditionValue !== "good" &&
    conditionValue !== "not-applicable" &&
    selectedValue !== "";

  const shouldShowPoints =
    pointsCondition &&
    condition &&
    conditionValue !== "good" &&
    conditionValue !== "not-applicable" &&
    selectedValue !== "";

  return (
    <View
      style={{
        backgroundColor: colors.whiteBg,
        borderRadius: 5,
        minHeight: 10,
        padding: 20,
        gap: 20,
        borderWidth: 0.5,
        borderColor: error ? colors.green : colors.whiteBg,
      }}
    >
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
            value={reasonValue} // Bind the value
            onChangeText={handleReasonValueChange} // Handle text change
          />
        </View>
      )}
      {shouldShowPoints && (
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

const styles = StyleSheet.create({});
