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
}) => {
  const handleValueChange = () => {
    onValueChange(selectedValue);
  };

  const [tyreSize, setTyreSize] = useState("");

  const handleInputChange = (value) => {
    // Remove any non-alphanumeric characters except "/"
    let formattedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Add slashes automatically
    if (formattedValue.length > 3) {
      formattedValue =
        formattedValue.slice(0, 3) + "/" + formattedValue.slice(3);
    }
    if (formattedValue.length > 6) {
      formattedValue =
        formattedValue.slice(0, 6) + "/" + formattedValue.slice(6);
    }

    setTyreSize(formattedValue);
  };

  return (
    <View style={styles.inspectionBox}>
      <AppText
        fontSize={mainStyles.h1FontSize}
        color={colors.fontBlack}
        fontFamily={mainStyles.appFontBold}
        flex={1}
      >
        {num}. {indicator}
      </AppText>
      {showType === "n" && (
        <AppTextInput
          placeholder={"In Milimeter"}
          onValueChange={handleValueChange}
        />
      )}
      {showType === "s" && (
        <AppTextInput
          placeholder={"E.g: 18565R15"}
          maxLength={8}
          onChangeText={handleInputChange}
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

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    minHeight: 10,
    padding: 20,
    gap: 20,
    flex: 1,
  },
});
