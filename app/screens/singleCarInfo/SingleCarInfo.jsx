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
import InspectionRatingCard from "../../components/card/InspectionRatingCard";

const SingleCarInfo = ({ route, navigation }) => {
  const { id } = route.params || {};

  console.log(id);

  const [carInfo, setCarInfo] = useState(null);
  const [carRatingInfo, setCarRatingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(carInfo?.carPic);

  useEffect(() => {
    if (!id) {
      setError(new Error("No ID provided"));
      setLoading(false);
      return;
    }

    fetchCarData();
    fetchCarRatingData();
  }, [id]);

  const fetchCarData = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_singlecarinfos.php?id=${id}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setCarInfo(response.data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchCarRatingData = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_singlecarratinginfos.php?id=${id}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setCarRatingInfo(response.data);
      console.log(carRatingInfo);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

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
        <View style={styles.ContentContainer}>
          <View style={styles.contentBox}>
            <AppText textAlign={"center"} fontSize={mainStyles.h1FontSize}>
              Inspection Report
            </AppText>
          </View>
          <View style={styles.contentBox}>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Inspection Date:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.inspectionDate}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Car:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.car}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Variant:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.varientId}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Model:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.model}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Registration No:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.registrationNo}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Chasis No:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.chasisNo}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Manufacturer:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.mfgId}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                CPLC:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.cplc}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                No Of Owners:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.NoOfOwners}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Transmission Type:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.transmissionType}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Mileage:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.mileage}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Registration City:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.registrationCity}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Fuel Type:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
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
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Color:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.color}
              </AppText>
            </View>
            <View style={styles.infoContainer}>
              <AppText minWidth={120}
                    maxWidth={120} fontSize={mainStyles.h3FontSize}>
                Overall Rating:
              </AppText>

              <View style={styles.line} />

              <AppText
                fontSize={mainStyles.h3FontSize}
                minWidth={120}
                    maxWidth={120}
                textAlign={"right"}
              >
                {carInfo.rank}
              </AppText>
            </View>
          </View>
          <View style={styles.contentBox}>
            <AppText textAlign={"center"} fontSize={mainStyles.h1FontSize}>
              Inspection Rating Report
            </AppText>
          </View>
          {carRatingInfo.map((item) => (
            <InspectionRatingCard
              key={item?.id}
              category={item?.category}
              indicators={item?.indicators}
            />
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default SingleCarInfo;

const styles = StyleSheet.create({
  ContentContainer: {
    gap: 10,
  },
  contentBox: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    gap: 7,
    elevation: 2,
  },
  container: {
    padding: 20,
    paddingTop: 0,
  },
  line: {
    height: 20,
    width: 0.5,
    backgroundColor: colors.fontGrey,
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
    borderRadius: 5,
    borderColor: colors.ligtGreyBg,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: colors.whiteBg,
    gap: 5,
  },
  infoKey: {
    fontWeight: "bold",
    marginRight: 8,
  },
  infoValue: {
    flexShrink: 1,
  },
});
