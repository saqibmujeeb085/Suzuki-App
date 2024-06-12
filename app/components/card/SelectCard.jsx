import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import AppText from "../text/Text";
import { RadioGroup } from "react-native-radio-buttons-group";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";

const SelectCard = ({
  indicator,
  value,
  onValueChange,
  num,
  onImageSelected,
  onSelectedImageName,
  onRemoveImage,
  questionId,
}) => {
  const [selectedId, setSelectedId] = useState(null);

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "Yes",
        value: true,
        color: "#003790",
      },
      {
        id: "2",
        label: "No",
        value: false,
        color: "#003790",
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
      <AppText fontSize={12} color={"#1d1d1d"} lineHeight={18} maxWidth={218}>
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
      <View>
        <InspectionImagePicker
          onImageSelected={(uri) => onImageSelected(questionId, uri)}
          onSelectedImageName={(name) => onSelectedImageName(questionId, name)}
          onRemoveImage={() => onRemoveImage(questionId)}
        />
      </View>
    </View>
  );
};

export default SelectCard;

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: "white",
    borderRadius: 5,
    minHeight: 10,
    padding: 20,
    gap: 20,
  },
});
