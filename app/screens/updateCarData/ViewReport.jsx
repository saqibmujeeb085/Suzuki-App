import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import InspectionHeader from "../../components/header/InspectionHeader";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ProcessModal from "../../components/modals/ProcessModal";
import { FormDataContext } from "../../context/formDataContext";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";
import GradientButton from "../../components/buttons/GradientButton";

const ViewReport = ({ navigation, route }) => {
  const [
    manufacturersData,
    setManufacturersData,
    modelsData,
    setModelsData,
    varientsData,
    setVarientsData,
    yearsData,
    setYearsData,
    colorsData,
    setColorsData,
    fuelsData,
    setFuelsData,
    transmissionsData,
    setTransmissionsData,
    capacitiesData,
    setCapacitiesData,
    citiesData,
    setCitiesData,
  ] = useContext(FormDataContext);

  const { id } = route.params || {};
  const [show, setShow] = useState(false);
  const [carInfo, setCarInfo] = useState(null);
  const [carBodyProblems, setCarBodyProblems] = useState(null);
  console.log("helloooo:", carBodyProblems);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        ShowModal(); // Run showModal when back button is pressed
        return true; // Prevent the default back button behavior
      };

      // Add event listener for the hardware back button
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Clean up the event listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [ShowModal]) // Add ShowModal as a dependency
  );

  useEffect(() => {
    getCarDataByTempID(`${id}`);
    getCarProblemsDataByTempID(`${id}`);
  }, []);

  const getCarDataByTempID = async (tempID) => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata");

      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);
        const carData = carFormDataArray.find((item) => item.tempID == tempID);
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

  const getCarProblemsDataByTempID = async (tempID) => {
    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");

      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);
        const carbodyques = carFormDataArray.filter(
          (item) => item.tempID == tempID
        );
        if (carbodyques) {
          setCarBodyProblems(carbodyques);
          return carbodyques;
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

  const getManufacturer = (manufacturerId) => {
    if (manufacturersData) {
      const m = manufacturersData.find((item) => item.key == manufacturerId);
      return m ? m.value : "Unknown Manufacturer";
    }
  };

  const getCarModel = (carId, manufacturerId) => {
    const models = modelsData[manufacturerId];
    if (models) {
      const model = models.find((item) => item.key == carId);
      return model ? model.value : "Unknown Model";
    }
    return "Unknown Model";
  };

  const getCarVarient = (varientId, carId) => {
    const v = varientsData[carId];
    if (v) {
      const varient = v.find((item) => item.key == varientId);
      return varient ? varient.value : "Unknown Varient";
    }
    return "Unknown Model";
  };

  const handleSaveForLater = useCallback(() => {
    navigation.navigate("Draft");
  }, [navigation]);

  const ShowModal = useCallback(() => {
    setShow((prevShow) => !prevShow);
  }, []);
  return (
    <AppScreen>
      {show && (
        <ProcessModal
          show={show}
          setShow={setShow}
          icon
          heading={"Customer ID: 0KD560PLF"}
          text={"If you cancel the inspection, it will be saved as a draft"}
          pbtn={"Continue Editing Inspection"}
          pbtnPress={ShowModal}
          sbtn={"Save for later"}
          sbtnPress={handleSaveForLater}
          sbtnColor={"#D20000"}
        />
      )}

      <InspectionHeader
        backIcon={false}
        borderBottom={true}
        rightText={"Cancel"}
        rightOnpress={ShowModal}
      >
        Inspection Car Report
      </InspectionHeader>

      <ScrollView
        style={[{ marginBottom: 100, paddingBottom: 20 }, styles.container]}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headingContainer}>
            <AppText
              fontSize={mainStyles.h1FontSize}
              fontFamily={mainStyles.appFontBold}
            >
              Car Information
            </AppText>
            <TouchableOpacity
              style={{
                backgroundColor: colors.purple,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Feather name="edit" size={20} color={colors.whiteBg} />
            </TouchableOpacity>
          </View>

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
              {getCarModel(carInfo?.carId, carInfo?.mfgId)}
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
              {getCarVarient(carInfo?.varientId, carInfo?.carId)}
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
              {getManufacturer(carInfo?.mfgId)}
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
        <View style={[styles.contentContainer, { marginTop: 20 }]}>
          <AppText
            fontSize={mainStyles.h1FontSize}
            fontFamily={mainStyles.appFontBold}
            textAlign={"center"}
          >
            Car Body Problems
          </AppText>
          <View
            style={{
              gap: 10,
              paddingVertical: 5,
              justifyContent: "space-between",
            }}
          >
            {carBodyProblems &&
              carBodyProblems.map((item, index) => (
                <View key={index} style={{ flexDirection: "column" }}>
                  {/* Display problem location */}
                  <View style={styles.headingContainer}>
                    <AppText
                      fontSize={mainStyles.h2FontSize}
                      fontFamily={mainStyles.appFontBold}
                    >
                      {item.problemLocation}
                    </AppText>
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Feather name="edit" size={20} color={colors.purple} />
                    </TouchableOpacity>
                  </View>

                  {/* Map over the problems array to display each problem */}
                  <View>
                    {item.problems.map((problem, problemIndex) => (
                      <View
                        key={problemIndex}
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          padding: 5,
                          justifyContent: "space-between",
                        }}
                      >
                        <AppText>{problem.problemName}</AppText>
                        <AppText>{problem.selectedValue}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton>Submit Inspection Report</GradientButton>
      </View>
    </AppScreen>
  );
};

export default ViewReport;

const styles = StyleSheet.create({
  headingContainer: {
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: colors.whiteBg,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
  },
  container: {
    padding: 16,
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
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
