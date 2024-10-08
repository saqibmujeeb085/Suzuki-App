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
  const [carIndicatorsRating, setCarIndicatorsRating] = useState(null);

  // This useFocusEffect ensures the data reloads every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        ShowModal(); // Run showModal when back button is pressed
        return true; // Prevent the default back button behavior
      };

      // Add event listener for the hardware back button
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Fetch all car data, car body problems, and car indicator ratings when the screen comes into focus
      getCarDataByTempID(`${id}`);
      getCarProblemsDataByTempID(`${id}`);
      getCarIndicatorsRating(`${id}`);

      return () => {
        // Clean up the event listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [ShowModal]) // Add ShowModal as a dependency
  );

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

  const getCarIndicatorsRating = async (tempID) => {
    try {
      const storedData = await AsyncStorage.getItem("@carQuestionsdata");

      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);

        const carData = carFormDataArray.filter(
          (item) => item.QtempID == tempID
        );

        const groupedData = carData.reduce((acc, item) => {
          const {
            catName,
            subCatName,
            IndID,
            IndQuestion,
            value,
            point,
            reason,
            image,
          } = item;

          let category = acc.find((cat) => cat.mainCat == catName);

          if (!category) {
            category = {
              QtempID: `${tempID}`,
              mainCat: catName,
              mainCatData: [],
            };
            acc.push(category);
          }

          let subCategory = category.mainCatData.find(
            (subCat) => subCat.subCatName == subCatName
          );

          if (!subCategory) {
            subCategory = {
              subCatName: subCatName,
              subCatData: [],
            };
            category.mainCatData.push(subCategory);
          }

          const dataItem = {
            IndID: IndID,
            IndQuestion: IndQuestion,
            value: value,
            point: point,
            reason: reason,
            image: image,
          };

          subCategory.subCatData.push(dataItem);

          return acc;
        }, []);

        if (groupedData) {
          setCarIndicatorsRating(groupedData);
          return groupedData;
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
    setShow((prevShow) => !prevShow);
    navigation.navigate("Draft");
  }, [navigation]);

  const ShowModal = useCallback(() => {
    setShow((prevShow) => !prevShow);
  }, []);

  const editInfo = () => {
    navigation.navigate("EditCarInfo", { id: `${id}` });
  };

  const editProblems = (location) => {
    navigation.navigate("EditProblems", { id: `${id}`, location: location });
  };

  const editIndicator = (id, mainCat, subCatName, indQuestion) => {
    navigation.navigate("EditIndicatorsRating", {
      id: id,
      mainCat: mainCat,
      subCatName: subCatName,
      indQuestion: indQuestion,
    });
  };

  const changeStatus = async () => {
    try {
      // Retrieve the data from AsyncStorage
      const storedData = await AsyncStorage.getItem("@carformdata");

      if (storedData !== null) {
        // Parse the stored data
        const carFormDataArray = JSON.parse(storedData);

        // Log the carFormDataArray to see if it has valid data
        console.log("Stored carFormDataArray:", carFormDataArray);

        // Convert id to a number for comparison with tempID
        const tempIDAsNumber = Number(id);

        // Check if the array contains the car with the matching tempID
        const carData = carFormDataArray.find(
          (item) => item.tempID === tempIDAsNumber
        );

        if (carData) {
          console.log("Found car data:", carData);

          // Map through the array and update the status of the matching car
          const updatedCarFormDataArray = carFormDataArray.map((item) => {
            if (item.tempID === tempIDAsNumber) {
              return {
                ...item,
                status: "inspected", // Update status to "inspected"
              };
            }
            return item;
          });

          // Save the updated data back to AsyncStorage
          await AsyncStorage.setItem(
            "@carformdata",
            JSON.stringify(updatedCarFormDataArray)
          );

          console.log("Status changed successfully");
          // Navigate back to "Draft" or any other screen
          navigation.navigate("Home");
        } else {
          console.log(
            "No car data found with the given tempID:",
            tempIDAsNumber
          );
        }
      } else {
        console.log("No car data found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error updating car status:", error);
    }
  };

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

      <ScrollView style={[{ marginBottom: 110 }, styles.container]}>
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
              onPress={editInfo}
            >
              <Feather name="edit" size={20} color={colors.whiteBg} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
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
              <AppText style={{ fontSize: mainStyles.h3FontSize }}>
                Car:
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
              <AppText style={{ fontSize: mainStyles.h3FontSize }}>
                CPLC:
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
                      onPress={() => editProblems(item.problemLocation)}
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
                          padding: 10,
                          paddingTop: 0,
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

        <View style={[styles.contentContainer, { marginTop: 20 }]}>
          <AppText
            fontSize={mainStyles.h1FontSize}
            fontFamily={mainStyles.appFontBold}
            textAlign={"center"}
          >
            Car Indicators Rating
          </AppText>
          <View
            style={{
              gap: 10,
              paddingVertical: 5,
              justifyContent: "space-between",
            }}
          >
            {carIndicatorsRating &&
              carIndicatorsRating.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "column",
                    elevation: 2,
                    padding: 10,
                    backgroundColor: colors.whiteBg,
                    borderRadius: 3,
                  }}
                >
                  <View
                    key={index}
                    style={{
                      flexDirection: "column",
                      elevation: 2,
                      padding: 10,
                      backgroundColor: colors.whiteBg,
                      borderRadius: 3,
                    }}
                  >
                    <AppText
                      fontSize={mainStyles.h2FontSize}
                      fontFamily={mainStyles.appFontBold}
                      textAlign={"center"}
                    >
                      {item.mainCat}
                    </AppText>
                  </View>

                  {item.mainCatData.map((subItem, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "column",
                        elevation: 2,
                        padding: 10,
                        backgroundColor: colors.whiteBg,
                        borderRadius: 3,
                        marginTop: 10,
                      }}
                    >
                      <View
                        key={index}
                        style={{
                          flexDirection: "column",
                          elevation: 2,
                          padding: 10,
                          backgroundColor: colors.whiteBg,
                          borderRadius: 3,
                          marginBottom: 10,
                        }}
                      >
                        <AppText
                          fontSize={mainStyles.h3FontSize}
                          fontFamily={mainStyles.appFontBold}
                        >
                          {subItem.subCatName}
                        </AppText>
                      </View>
                      {subItem.subCatData.map((i, index) => (
                        <View key={index}>
                          <View style={styles.headingContainer}>
                            <AppText
                              fontSize={mainStyles.h3FontSize}
                              fontFamily={mainStyles.appFontBold}
                              numberOfLines={1}
                              maxWidth={200}
                            >
                              {i.IndID}. {i.IndQuestion}
                            </AppText>
                            <TouchableOpacity
                              style={{
                                padding: 10,
                                borderRadius: 5,
                              }}
                              onPress={() =>
                                editIndicator(
                                  item.QtempID,
                                  item.mainCat,
                                  subItem.subCatName,
                                  i.IndQuestion,
                                  i.point,
                                  i.reason
                                )
                              }
                            >
                              <Feather
                                name="edit"
                                size={20}
                                color={colors.purple}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                              padding: 5,
                              paddingTop: 0,
                              marginBottom: 10,
                              justifyContent: "space-between",
                            }}
                          >
                            <AppText>
                              {typeof i.value === "number" ? "Rating" : "Value"}
                            </AppText>
                            <AppText>
                              {i.value}
                              {typeof i.value === "number" && "/5"}
                            </AppText>
                          </View>
                          {i.point && (
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                padding: 5,
                                justifyContent: "space-between",
                              }}
                            >
                              <AppText>Problem</AppText>
                              <AppText>{i.point}</AppText>
                            </View>
                          )}

                          {i.reason && (
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                padding: 5,
                                justifyContent: "space-between",
                              }}
                            >
                              <AppText maxWidth={150}>Reason</AppText>
                              <AppText>{i.reason}</AppText>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton onPress={changeStatus}>
          Submit Inspection Report
        </GradientButton>
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
