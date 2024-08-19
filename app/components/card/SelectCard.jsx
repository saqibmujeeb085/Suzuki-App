import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
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
  img = false,
  textBox = false,
}) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleValueChange = (id) => {
    const selectedValue = options.find((radio) => radio.id === id).value;
    setSelectedId(id);
    onValueChange(selectedValue);
  };

  const handlePonitsValueChange = (id) => {
    const selectedValue = points.find((radio) => radio.id === id).value;
    setSelectedId(id);
    onValueChange(selectedValue);
  };

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
      {img && (
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
      {textBox && (
        <View style={{ paddingHorizontal: 12 }}>
          <AppTextInput
            inputMode={"textArea"}
            multiline
            numberOfLines={3}
            placeholder="Mention Reason"
          />
        </View>
      )}
      {points && points.length > 0 && (
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
            onPress={handlePonitsValueChange}
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
