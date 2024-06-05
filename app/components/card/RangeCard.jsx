import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AppText from '../text/Text';

const RangeCard = ({ indicator, value, onValueChange, num }) => {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    setSliderValue(newValue);
    onValueChange(newValue);
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
      <View style={styles.sliderContainer}>
        <AppText textAlign={"right"} fontSize={14} color={"#212121"}>
          {sliderValue}/10
        </AppText>
        <Slider
          style={{
            minWidth: "100%",
            height: 20,
            marginTop: 10,
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={sliderValue}
          onValueChange={handleValueChange}
          minimumTrackTintColor="#003790"
          maximumTrackTintColor="#E1E1E1"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: "white",
    borderRadius: 5,
    minHeight: 10,
    padding: 20,
    gap: 20,
  },
  sliderContainer: {
    marginTop: 10,
  },
});

export default RangeCard;
