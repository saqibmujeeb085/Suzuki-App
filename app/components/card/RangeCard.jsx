import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AppText from '../text/Text';
import circle from "../../assets/componentsImages/circle.png"

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
        <View style={styles.range}>
          <View style={styles.lineOne}></View>
          <View style={styles.lineTwo}></View>
          <View style={styles.lineThree}></View>
          <View style={styles.lineFour}></View>
          <View style={styles.lineFive}></View>
          <View style={styles.lineSix}></View>
          <View style={styles.lineSeven}></View>
          <View style={styles.lineEight}></View>
          <View style={styles.lineNine}></View>
        <Slider
          style={{
            minWidth: "100%",
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
          minimumValue={0}
          maximumValue={10}
          step={20}
          value={sliderValue}
          onValueChange={handleValueChange}
          minimumTrackTintColor="#FF000000"  
          maximumTrackTintColor="#00FF0000"
          thumbTintColor='#003790'
          thumbImage={circle}
        />
        </View>
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
  lineOne: {
    position: "absolute",
    top: 5,
    left: "10%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineTwo: {
    position: "absolute",
    top: 5,
    left: "20%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineThree: {
    position: "absolute",
    top: 5,
    left: "30%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineFour: {
    position: "absolute",
    top: 5,
    left: "40%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineFive: {
    position: "absolute",
    top: 5,
    left: "50%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineSix: {
    position: "absolute",
    top: 5,
    left: "60%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineSeven: {
    position: "absolute",
    top: 5,
    left: "70%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineEight: {
    position: "absolute",
    top: 5,
    left: "80%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  },
  lineNine: {
    position: "absolute",
    top: 5,
    left: "90%",
    height: 6,
    width: 1,
    backgroundColor: "#000000"
  }
});

export default RangeCard;
