import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler, // Import BackHandler
} from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import IconButton from "../../components/buttons/IconButton";
import GradientButton from "../../components/buttons/GradientButton";
import ProcessModal from "../../components/modals/ProcessModal";
import InspectionBoardCard from "../../components/card/InspectionBoardCard";
import { useFocusEffect } from "@react-navigation/native";
import InspectionSkeletonPreloader from "../../components/skeletonLoader/InspectionSkeletonPreloader";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import InspectionHeader from "../../components/header/InspectionHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormDataContext } from "../../context/formDataContext";
import { categories } from "../../data/categoriesdata";

const InspectionBoard = ({ navigation, route }) => {
  const { id } = route.params || {};

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

  const [checkCategories, setCheckCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [submitShow, setSubmitShow] = useState(false);
  const [allInspectionsDone, setAllInspectionsDone] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading to true
  const [carInfo, setCarInfo] = useState(null);

  useEffect(() => {}, []);

  const fetchData = useCallback(async () => {
    await getCarDataByTempID(id);
    await checkCategoriesPresent(id);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Add the back button handler inside useFocusEffect
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

  const checkCategoriesPresent = async (id) => {
    try {
      const quesString = await AsyncStorage.getItem("@carQuestionsdata");
      const allQuestions = quesString ? JSON.parse(quesString) : []; // Parse or use empty array if null

      // Filter questions based on QtempId
      const ques = allQuestions.filter((q) => q.QtempID === `${id}`);

      // console.log("present data", ques);

      const categoryIds = categories.map((category) => category.id);

      const allCategoriesPresent = categoryIds.every((categoryId) =>
        ques.some((q) => q.catID === categoryId)
      );

      // Create the desired format
      const categoryStatus = categoryIds.map((categoryId) => ({
        catId: categoryId,
        inspectionIsDone: ques.some((q) => q.catID === categoryId),
      }));
      setCheckCategories(categoryStatus);

      setAllInspectionsDone(allCategoriesPresent);
    } catch (error) {
      console.error("Error checking categories:", error);
      return false;
    }
  };

  const getManufacturer = (manufacturerId) => {
    if (manufacturersData) {
      const m = manufacturersData.find((item) => item.key === manufacturerId);
      return m ? m.value : "Unknown Manufacturer";
    }
  };

  const getCarModel = (carId, manufacturerId) => {
    const models = modelsData[manufacturerId];
    if (models) {
      const model = models.find((item) => item.key === carId);
      return model ? model.value : "Unknown Model";
    }
    return "Unknown Model";
  };

  const getCarVarient = (varientId, carId) => {
    const v = varientsData[carId];
    if (v) {
      const varient = v.find((item) => item.key === varientId);
      return varient ? varient.value : "Unknown Varient";
    }
    return "Unknown Model";
  };

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

  const ShowModal = useCallback(() => {
    setShow((prevShow) => !prevShow);
  }, []);

  const ShowSubmitModal = useCallback(() => {
    setSubmitShow((prevShow) => !prevShow);
  }, []);

  const viewReport = () => {
    setSubmitShow((prevShow) => !prevShow);
    navigation.navigate("ViewReport", {
      id: `${id}`,
    });
  };

  const changeStatus = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);
        const updatedCarFormDataArray = carFormDataArray.map((item) => {
          if (item.tempID === id) {
            return {
              ...item,
              status: "inspected",
            };
          }
          return item;
        });

        await AsyncStorage.setItem(
          "@carformdata",
          JSON.stringify(updatedCarFormDataArray)
        );
        setSubmitShow((prevShow) => !prevShow);
        navigation.navigate("Home");
      } else {
        console.log("No car data found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error updating car status:", error);
    }
  };

  const handleSaveForLater = useCallback(() => {
    setShow((prevShow) => !prevShow);
    navigation.navigate("Draft");
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [id])
  );

  const catIcons = [
    {
      id: 1,
      icon: "car",
    },
    {
      id: 7,
      icon: "steering",
    },
    {
      id: 3,
      icon: "car-clutch",
    },
    {
      id: 4,
      icon: "car-door",
    },
    {
      id: 5,
      icon: "engine-outline",
    },
    {
      id: 6,
      icon: "car-brake-worn-linings",
    },
    {
      id: 2,
      icon: "tools",
    },
  ];

  return (
    <AppScreen>
      {show && (
        <ProcessModal
          show={show}
          setShow={setShow}
          icon
          pbtn={"Continue Inspection"}
          pbtnPress={ShowModal}
          sbtn={"Save for later"}
          sbtnPress={handleSaveForLater}
          sbtnColor={"#D20000"}
        />
      )}

      {submitShow && (
        <ProcessModal
          show={submitShow}
          setShow={ShowSubmitModal}
          icon
          heading={`Registration No: ${carInfo?.registrationNo}`}
          text={
            "Want To Submit The Inspection Or Want To View Report Before Submiting"
          }
          pbtn={"Submit Inspection"}
          pbtnPress={changeStatus}
          sbtn={"View Report"}
          sbtnPress={viewReport}
        />
      )}

      <InspectionHeader backIcon={false} borderBottom={false}>
        Inspection Board
      </InspectionHeader>
      <ScrollView style={{ marginBottom: 90 }}>
        <ImageBackground
          style={styles.customerSummarycontainerbackgroundImage}
          source={require("../../assets/componentsImages/summaryBackground.png")}
        >
          <View style={styles.customerSummarycontainer}>
            <View style={styles.customerDetailsAndLogout}>
              <View style={styles.customerDetails}>
                <AppText
                  color={colors.fontWhite}
                  fontSize={mainStyles.h2FontSize}
                  textTransform={"capitalize"}
                >
                  {getManufacturer(carInfo?.mfgId)}{" "}
                  {getCarModel(carInfo?.carId, carInfo?.mfgId)}
                </AppText>
                <AppText
                  color={colors.fontGrey}
                  fontSize={mainStyles.h3FontSize}
                >
                  Varient: {getCarVarient(carInfo?.varientId, carInfo?.carId)}
                </AppText>
              </View>
              {/* <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                <View style={styles.timer}>
                  <Image
                    source={require("../../assets/componentsImages/timer.png")}
                  />
                  <View style={styles.time}>
                    <AppText
                      color={colors.fontWhite}
                      fontSize={mainStyles.h4FontSize}
                    >
                      Time Left
                    </AppText>
                    <AppText
                      color={colors.fontWhite}
                      fontSize={mainStyles.h2FontSize}
                    >
                      19:25
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity> */}
              <Image
                source={require("../../assets/icon.png")}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  borderRadius: 50,
                }}
              />
            </View>
            <View style={styles.breakLine} />
            <View style={styles.summaryContainer}>
              <View style={styles.summaryBox}>
                <AppText
                  color={colors.fontGrey}
                  fontSize={mainStyles.h3FontSize}
                >
                  Mileage
                </AppText>
                <AppText
                  color={colors.fontWhite}
                  fontSize={mainStyles.h3FontSize}
                >
                  {carInfo?.mileage} km
                </AppText>
              </View>
              <View style={styles.summaryBox}>
                <AppText
                  color={colors.fontGrey}
                  fontSize={mainStyles.h3FontSize}
                >
                  Year
                </AppText>
                <AppText
                  color={colors.fontWhite}
                  fontSize={mainStyles.h3FontSize}
                >
                  {carInfo?.model}
                </AppText>
              </View>
              <View style={styles.summaryBox}>
                <AppText
                  color={colors.fontGrey}
                  fontSize={mainStyles.h3FontSize}
                >
                  Registration No
                </AppText>
                <AppText
                  color={colors.fontWhite}
                  fontSize={mainStyles.h3FontSize}
                >
                  {carInfo?.registrationNo}
                </AppText>
              </View>
              <View style={styles.summaryBox}>
                <AppText
                  color={colors.fontGrey}
                  fontSize={mainStyles.h3FontSize}
                >
                  Engine
                </AppText>
                <AppText
                  color={colors.fontWhite}
                  fontSize={mainStyles.h3FontSize}
                >
                  {carInfo?.engineDisplacement}
                </AppText>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.InspectionBoardContainer}>
          <View style={styles.headingAndButton}>
            <View style={styles.headingWithIcon}>
              <AppText fontSize={mainStyles.h2FontSize} color={"#323232"}>
                Inspection Details
              </AppText>
            </View>
            <IconButton
              onPress={ShowModal}
              icon={"av-timer"}
              color={colors.fontBlack}
              fontSize={mainStyles.h2FontSize}
            >
              Save For Later
            </IconButton>
          </View>
          {loading ? (
            <View style={styles.inspectionCardsBox}>
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <InspectionSkeletonPreloader key={index} />
                ))}
            </View>
          ) : (
            <View style={styles.inspectionCardsBox}>
              {categories.map((item) => {
                const checkCategory = checkCategories.find(
                  (cat) => cat.catId === item.id
                );

                const checkIcon = catIcons.find((icon) => icon.id === item.id);

                return (
                  <InspectionBoardCard
                    key={item.id}
                    name={item.category}
                    inspectionIsDone={
                      checkCategory ? checkCategory.inspectionIsDone : false
                    }
                    // Rating={checkCategory ? checkCategory.Rating : ""}
                    icon={checkIcon?.icon}
                    onPress={() =>
                      navigation.navigate("SingleInspection", {
                        tempID: id,
                        catid: item.id,
                        catName: item.category,
                      })
                    }
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton
          onPress={ShowSubmitModal}
          disabled={!allInspectionsDone}
        >
          Submit Inspection
        </GradientButton>
      </View>
    </AppScreen>
  );
};

export default InspectionBoard;

const styles = StyleSheet.create({
  headingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  customerSummarycontainerbackgroundImage: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  customerSummarycontainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 10,
  },
  customerDetailsAndLogout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerDetails: {
    gap: 2,
  },
  timer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  time: {
    justifyContent: "center",
    alignItems: "center",
  },
  breakLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#255BB3",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  summaryBox: {
    gap: 2,
  },
  headingAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  InspectionBoardContainer: {
    marginTop: 20,
  },
  inspectionCardsBox: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  inspectionButton: {
    marginTop: 10,
  },
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
