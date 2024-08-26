import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import { mainStyles } from "../../constants/style";
import CarBodyModal from "../modals/CarBodyModal";

const CarBody = ({ catId, tempID }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);

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

  const handleDotPress = (problemName) => {
    setActiveProblem(problemName);
    setShowModal(true);
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
      />

      <View
        style={{
          backgroundColor: colors.whiteBg,
          borderRadius: 5,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          flexDirection: "row",
        }}
      >
        <AppText
          fontSize={20}
          fontFamily={mainStyles.appFontBold}
          color={colors.red}
        >
          L
        </AppText>

        <View
          style={{
            width: 350,
            height: 520,
            alignSelf: "center",
            flex: 1,
            position: "relative",
          }}
        >
          <ImageBackground
            resizeMode="contain"
            style={{
              width: 320,
              height: 520,
              alignSelf: "center",
            }}
            source={require("../../assets/carBody.png")}
          >
            {problemAreas.map((area, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  position: "absolute",
                  ...area.position,
                  padding: 10,
                }}
                onPress={() => handleDotPress(area.name)}
              >
                <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
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

export default CarBody;

const styles = StyleSheet.create({});
