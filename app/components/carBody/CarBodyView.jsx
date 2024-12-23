import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";

const CarBodyView = ({ carBodyData }) => {
  const shortCodeMapping = {
    "Shower Paint": "P1",
    "Polyster Paint": "P2",
    "Minor Dent": "D1",
    "Major Dent": "D2",
    "Minor Scratch": "S1",
    "Major Scratch": "S2",
    "Replaced Panel": "R",
    // Add more mappings as needed
  };

  const problemAreas = [
    { name: "Front Bumper", position: { top: 40, left: 135 } },
    { name: "Bonnet Left Side", position: { top: 100, left: 100 } },
    { name: "Bonnet Right Side", position: { top: 100, right: 110 } },
    { name: "Roof", position: { top: 250, left: 135 } },
    { name: "Tailgate Left Side", position: { top: 350, left: 110 } },
    { name: "Tailgate Right Side", position: { top: 350, right: 120 } },
    { name: "Rear Bumper", position: { top: 420, left: 140 } },
    { name: "Back Left Fender", position: { top: 350, left: 50 } },
    { name: "Back Left Door", position: { top: 270, left: 30 } },
    { name: "Front Left Door", position: { top: 200, left: 30 } },
    { name: "Front Left Fender", position: { top: 140, left: 45 } },
    { name: "Front Right Fender", position: { top: 120, right: 52 } },
    { name: "Front Right Door", position: { top: 200, right: 45 } },
    { name: "Back Right Door", position: { top: 260, right: 45 } },
    { name: "Back Right Fender", position: { top: 360, right: 60 } },
  ];

  // Function to get the short code
  const getShortCode = (value) => {
    return shortCodeMapping[value] || value;
  };

  // Function to get color based on short code
  const getColorByShortCode = (shortCode) => {
    if (shortCode === "P1" || shortCode === "P2") return colors.purple;
    if (shortCode === "D1" || shortCode === "D2") return colors.red;
    if (shortCode === "S1" || shortCode === "S2") return colors.blue;
    if (shortCode === "R") return colors.green;
    return colors.black; // Default color if no match
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageBackground
            resizeMode="contain"
            style={styles.imageBackground}
            source={require("../../assets/carBody.png")}
          >
            {problemAreas.map((area, index) => (
              <View
                key={index}
                style={{ ...styles.dot, ...area.position }}
                onPress={() => {}}
              >
                {carBodyData[area.name] && (
                  <View>
                    {carBodyData[area.name].map((problem, i) => {
                      const shortCode = getShortCode(problem.selected_value);
                      return (
                        <AppText
                          key={i}
                          fontSize={12}
                          color={getColorByShortCode(shortCode)} // Dynamic color
                          fontFamily={mainStyles.appFontBold}
                        >
                          {shortCode}
                        </AppText>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </ImageBackground>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  imageContainer: {
    width: 320,
    height: 500,
    alignSelf: "center",
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  imageBackground: {
    width: 300,
    height: 500,
    alignSelf: "center",
  },
  dot: {
    position: "absolute",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CarBodyView;
