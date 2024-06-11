import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import AppText from "../text/Text";
import circle from "../../assets/componentsImages/circle.png";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";

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
      <AppText fontSize={12} color={"#1d1d1d"} lineHeight={18} maxWidth={218}>
        {num + 1}. {indicator}
      </AppText>
      <View style={styles.sliderContainer}>
        <AppText textAlign={"right"} fontSize={14} color={"#212121"}>
          {sliderValue ? sliderValue : "NaN"} / 10
        </AppText>
        <View style={styles.range}>
          {[...Array(9)].map((_, index) => (
            <View
              key={index}
              style={{
                ...styles.line,
                left: `${(index + 1) * 10}%`,
              }}
            ></View>
          ))}
          <Slider
            style={{
              minWidth: "100%",
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={sliderValue}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#00379000"
            maximumTrackTintColor="#E1E1E100"
            thumbTintColor="#003790"
            thumbImage={circle}
          />
        </View>
      </View>
      <View>
        <InspectionImagePicker />
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
  range: {
    width: "100%",
    backgroundColor: "#E1E1E1",
    marginTop: 20,
    overflow: "visible",
    borderRadius: 20,
    maxHeight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    position: "absolute",
    top: 5,
    height: 6,
    width: 1,
    backgroundColor: "#000000",
  },
});

export default RangeCard;
