import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import AppText from "../text/Text";
import { RadioGroup } from "react-native-radio-buttons-group";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";

const TextCard = ({
  indicator,
  onValueChange,
  num,
  onImageSelected,
  onSelectedImageName,
  onRemoveImage,
  questionId,
  img = false,
}) => {
  const [selectedId, setSelectedId] = useState(null);

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "Yes",
        value: true,
        color: colors.blue,
      },
      {
        id: "2",
        label: "No",
        value: false,
        color: colors.blue,
      },
    ],
    []
  );

  const handleValueChange = (id) => {
    const selectedValue = radioButtons.find((radio) => radio.id === id).value;
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
        radioButtons={radioButtons}
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
  },
});
