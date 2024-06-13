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
import CarInfoSkeletonPreloader from "../../components/skeletonLoader/CarInfoSkeletonPreloader";
import CarImagesCarousel from "../../components/carousel/CarImagesCarousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SingleCarInfo = ({ route, navigation }) => {
  const { id } = route.params || {};

  console.log(id);

  const [carInfo, setCarInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(carInfo?.carPic);

  useEffect(() => {
    if (!id) {
      setError(new Error("No ID provided"));
      setLoading(false);
      return;
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_singlecarinfos.php?id=${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setCarInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CarInfoSkeletonPreloader />;
  }

  if (error) {
    return (
      <View>
        <AppText>Error: {error.message}</AppText>
      </View>
    );
  }

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Car Details
      </InspectionHeader>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.ImageContainer}>
          <CarImagesCarousel images={carInfo?.images} />
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
              {carInfo.inspectionDate}
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
              {carInfo.car}
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
              {carInfo.varientId}
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
              {carInfo.model}
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
              {carInfo.registrationNo}
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
              {carInfo.chasisNo}
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
              {carInfo.mfgId}
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
              {carInfo.cplc}
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
              {carInfo.NoOfOwners}
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
              {carInfo.transmissionType}
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
              {carInfo.mileage}
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
              {carInfo.registrationCity}
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
              {carInfo.FuelType}
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
              {carInfo.color}
            </AppText>
          </View>
          <View style={styles.infoContainer}>
            <AppText style={{ fontSize: mainStyles.h3FontSize }}>Rank:</AppText>
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
              {carInfo.rank}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default SingleCarInfo;

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
  },
  container: {
    padding: 20,
    paddingTop: 0,
  },
  ImageContainer: {
    flex: 1,
    height: "100%",
    minHeight: 400,
  },
  bannerImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 5,
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
});
