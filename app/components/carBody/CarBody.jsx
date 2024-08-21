import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { Image } from "react-native";
import { colors } from "../../constants/colors";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import { mainStyles } from "../../constants/style";

const CarBody = () => {
  return (
    <View>
      <View
        style={{
          backgroundColor: colors.whiteBg,
          borderRadius: 5,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          flexDirection: "row",
          //   width: 400,
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
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 30,
                left: 135,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>
            {/* ////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 100,
                left: 100,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ///////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 100,
                right: 110,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 250,
                left: 135,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 350,
                left: 100,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 350,
                right: 110,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 410,
                left: 135,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 350,
                left: 50,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 270,
                left: 30,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 200,
                left: 30,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 140,
                left: 45,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 140,
                right: 52,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 200,
                right: 45,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>

            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 270,
                right: 45,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>
            {/* ////////////////////////////// */}

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 350,
                right: 60,
                padding: 10,
              }}
            >
              <Octicons name="dot-fill" size={30} color={colors.fontBlack} />
            </TouchableOpacity>
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
