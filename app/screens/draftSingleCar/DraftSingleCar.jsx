import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import { mainStyles } from "../../constants/style";
import InspectionHeader from "../../components/header/InspectionHeader";
import { colors } from "../../constants/colors";
import GradientButton from "../../components/buttons/GradientButton";
import DeleteButton from "../../components/buttons/DeleteButton";
import { AntDesign } from "@expo/vector-icons";
import CarInfoSkeletonPreloader from "../../components/skeletonLoader/CarInfoSkeletonPreloader";
import CarImagesCarousel from "../../components/carousel/CarImagesCarousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraftCarImagesCarousel from "../../components/carousel/DraftCarImagesCarousel";

const DraftSingleCar = ({ route, navigation }) => {
  const { id } = route.params || {}; // Add a default empty object to avoid destructuring error

  console.log(id);

  const [carInfo, setCarInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(carInfo);

  const getCarDataByTempID = async (tempID) => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);
        const carData = carFormDataArray.find((item) => item.tempID === tempID);
        if (carData) {
          setCarInfo(carData);
          return carData;
        } else {
          console.log("No data found with tempID:", tempID);
          return null;
        }
      } else {
        console.log("No car data found in AsyncStorage");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving car data:", error);
      return null;
    }
  };

  useEffect(() => {
    getCarDataByTempID(id);
  }, []);

  const handleDelete = async () => {};

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Draft Car Details
      </InspectionHeader>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.ImageContainer}>
          {carInfo?.images ? (
            <DraftCarImagesCarousel images={carInfo.images} />
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Inspection Date:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.inspectionDate}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>Car:</AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.carId}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Variant:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.varientId}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Model:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.model}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Registration No:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.registrationNo}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Chasis No:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.chasisNo}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Manufacturer:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.mfgId}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>CPLC:</AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.cplc}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              No Of Owners:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.NoOfOwners}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Transmission Type:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.transmissionType}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Mileage:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.mileage}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Capacity:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.engineDisplacement}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Registration City:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.registrationCity}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Fuel Type:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              textTransform={"uppercase"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.FuelType}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>
              Color:
            </AppText>
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={150}
              textAlign={"right"}
              style={{
                fontSize: mainStyles.h3FontSize,
                color: colors.fontGrey,
                width: 200,
              }}
            >
              {carInfo?.color}
            </AppText>
          </View>
        </View>
        <View style={styles.ActionButtons}>
          <GradientButton
            onPress={() =>
              navigation.navigate("InspectionBoard", {
                id: id,
              })
            }
          >
            Save And Start Rating
          </GradientButton>
          <DeleteButton onPress={handleDelete}>
            <AntDesign
              name={"delete"}
              color={colors.fontRed}
              size={20}
              style={{ backgroundColor: "transparent" }}
            />
          </DeleteButton>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default DraftSingleCar;

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
  },
  container: {
    padding: 16,
  },
  bannerImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  infoKey: {
    fontWeight: "bold",
    marginRight: 8,
  },
  infoValue: {
    flexShrink: 1,
  },
  ActionButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
  },
  ImageContainer: {
    flex: 1,
    height: "100%",
    minHeight: 400,
  },
});
