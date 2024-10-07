import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import AppText from "../text/Text";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import AppTextInput from "../formFields/TextInput";

const TextCard = ({
  indicator,
  onValueChange,
  num,
  onImageSelected,
  onSelectedImageName,
  onRemoveImage,
  questionId,
  placeholder,
  img = false,
  showType,
  error,
}) => {
  const [tyreSize, setTyreSize] = useState("");

  // Function to format the tyre size input
  const formatTyreSize = (value) => {
    // Remove non-alphanumeric characters except "/"
    let cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Create an array of segments to format
    let segments = [];
    if (cleanedValue.length > 0) segments.push(cleanedValue.slice(0, 3));
    if (cleanedValue.length > 3) segments.push(cleanedValue.slice(3, 5));
    if (cleanedValue.length > 5) segments.push(cleanedValue.slice(5, 8));

    // Join segments with slashes
    return segments.join("/");
  };

  const handleInputChange = (value) => {
    const formattedValue = formatTyreSize(value);
    setTyreSize(formattedValue);
    onValueChange(formattedValue); // Call the parent function with the formatted value
  };
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
        zIndex={999}
      >
        {num}. {indicator}
      </AppText>
      {showType === "n" && (
        <AppTextInput
          placeholder={placeholder || "In Millimeter"}
          onChangeText={(text) => onValueChange(text)}
          inputMode={"numeric"}
        />
      )}
      {showType === "s" && (
        <AppTextInput
          placeholder={placeholder || "E.g: 18565R15"}
          maxLength={10} // Set length based on maximum formatted length
          onChangeText={handleInputChange}
          value={tyreSize} // Ensure the input value is controlled
        />
      )}
      {img && (
        <View style={{ flex: 1 }}>
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

export default TextCard;

const styles = StyleSheet.create({});
