import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import Octicons from "@expo/vector-icons/Octicons";
import CarBodyModal from "../modals/CarBodyModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mainStyles } from "../../constants/style";

const CarBody = ({ tempID }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState({});

  const problemAreas = [
    { name: "Front Left Door", position: { top: 30, left: 135 } },
    { name: "Front Left Fender", position: { top: 100, left: 100 } },
    { name: "Front Right Fender", position: { top: 100, right: 110 } },
    { name: "Hood", position: { top: 250, left: 135 } },
    { name: "Rear Left Door", position: { top: 350, left: 100 } },
    { name: "Rear Right Door", position: { top: 350, right: 110 } },
    { name: "Trunk", position: { top: 410, left: 135 } },
    { name: "Rear Left Fender", position: { top: 350, left: 50 } },
    { name: "Rear Left Bumper", position: { top: 270, left: 30 } },
    { name: "Left Rocker Panel", position: { top: 200, left: 30 } },
    { name: "Front Left Bumper", position: { top: 140, left: 45 } },
    { name: "Front Right Bumper", position: { top: 140, right: 52 } },
    { name: "Right Rocker Panel", position: { top: 200, right: 45 } },
    { name: "Rear Right Bumper", position: { top: 270, right: 45 } },
    { name: "Rear Right Fender", position: { top: 350, right: 60 } },
  ];

  const checkButtonStatus = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");
      const existingData = storedData ? JSON.parse(storedData) : [];

      const status = {};
      problemAreas.forEach((area) => {
        // Check if the area exists in the stored data for the given tempID
        const exists = existingData.some(
          (item) => item.problemLocation == area.name && item.tempID == tempID
        );
        status[area.name] = exists;
      });

      setDisabledButtons(status);
    } catch (error) {
      console.error("Error retrieving data from storage:", error);
    }
  };

  useEffect(() => {
    checkButtonStatus();
  }, [tempID]);

  const handleDotPress = (problemName) => {
    if (!disabledButtons[problemName]) {
      setActiveProblem(problemName);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (!showModal) {
      // Reset active problem when the modal is closed
      setActiveProblem(null);
    }
  }, [showModal]);

  return (
    <View>
      <CarBodyModal
        show={showModal}
        setShow={setShowModal}
        activeProblem={activeProblem}
        tempID={tempID}
        onSave={checkButtonStatus}
      />

      <View style={styles.container}>
        <AppText
          fontSize={20}
          fontFamily={mainStyles.appFontBold}
          color={colors.red}
        >
          L
        </AppText>

        <View style={styles.imageContainer}>
          <ImageBackground
            resizeMode="contain"
            style={styles.imageBackground}
            source={require("../../assets/carBody.png")}
          >
            {problemAreas.map((area, index) => (
              <TouchableOpacity
                key={index}
                style={{ ...styles.dot, ...area.position }}
                onPress={() => handleDotPress(area.name)}
                disabled={disabledButtons[area.name]}
              >
                <Octicons
                  name="dot-fill"
                  size={30}
                  color={
                    disabledButtons[area.name]
                      ? colors.purple
                      : colors.fontBlack
                  }
                />
              </TouchableOpacity>
            ))}
          </ImageBackground>
        </View>

        <AppText
          fontSize={20}
          fontFamily={mainStyles.appFontBold}
          color={colors.purple}
        >
          R
        </AppText>
      </View>
    </View>
  );
};

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
    width: 350,
    height: 520,
    alignSelf: "center",
    flex: 1,
    position: "relative",
  },
  imageBackground: {
    width: 320,
    height: 520,
    alignSelf: "center",
  },
  dot: {
    position: "absolute",
    padding: 10,
  },
});

export default CarBody;
