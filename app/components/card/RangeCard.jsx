import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import AppText from "../text/Text";
import circle from "../../assets/componentsImages/circle.png";
import InspectionImagePicker from "../imagePicker/InspectionImagePicker";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const RangeCard = ({
  indicator,
  value,
  onValueChange,
  num,
  onImageSelected,
  onSelectedImageName,
  onRemoveImage,
  questionId,
}) => {
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
        fontSize={mainStyles.h1FontSize}
        color={colors.fontBlack}
        fontFamily={mainStyles.appFontBold}
      >
        {num + 1}. {indicator}
      </AppText>
      <View style={styles.sliderContainer}>
        <AppText
          textAlign={"right"}
          fontSize={mainStyles.h2FontSize}
          color={"#212121"}
        >
          {sliderValue ? sliderValue : "NaN"} / 5
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
            maximumValue={5}
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
        <InspectionImagePicker
          onImageSelected={(uri) => onImageSelected(questionId, uri)}
          onSelectedImageName={(name) => onSelectedImageName(questionId, name)}
          onRemoveImage={() => onRemoveImage(questionId)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: colors.whiteBg,
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
