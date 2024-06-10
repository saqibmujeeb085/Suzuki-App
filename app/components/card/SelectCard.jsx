import { StyleSheet, View } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import AppText from '../text/Text';
import { RadioGroup } from 'react-native-radio-buttons-group';

const SelectCard = ({ indicator, value, onValueChange, num }) => {
  const [selectedId, setSelectedId] = useState(null);

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "Yes",
        value: true,
      },
      {
        id: "2",
        label: "No",
        value: false,
      },
    ],
    []
  );

  const handleValueChange = (id) => {
    const selectedValue = radioButtons.find(radio => radio.id === id).value;
    setSelectedId(id);
    onValueChange(selectedValue);
  };

  return (
    <View style={styles.inspectionBox}>
      <AppText
        fontSize={12}
        color={"#1d1d1d"}
        lineHeight={18}
        maxWidth={218}
      >
        {num + 1}. {indicator}
      </AppText>
      <RadioGroup
        containerStyle={{
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
        color="red"
        borderColor="red"
        radioButtons={radioButtons}
        onPress={handleValueChange}
        selectedId={selectedId}
      />
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
