import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import IconButton from "../../components/buttons/IconButton";
import GradientButton from "../../components/buttons/GradientButton";
import ProcessModal from "../../components/modals/ProcessModal";
import InspectionBoardCard from "../../components/card/InspectionBoardCard";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import InspectionSkeletonPreloader from "../../components/skeletonLoader/InspectionSkeletonPreloader";

const InspectionBoard = ({ navigation, route }) => {
  const { id } = route.params || {};

  const [categoriesList, setCategoriesList] = useState([]);
  const [checkCategories, setCheckCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [allInspectionsDone, setAllInspectionsDone] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading to true

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/auth/get_category.php");
      setCategoriesList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCheckCategories = async () => {
    try {
      const response = await axios.get(
        `/auth/get_checkInspectionCategories.php?carid=${id}`
      );
      setCheckCategories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching data
    }
  };

  useEffect(() => {
    const allDone = checkCategories.every((cat) => cat.inspectionIsDone);
    setAllInspectionsDone(allDone);
  }, [checkCategories]);

  const ShowModal = useCallback(() => {
    setShow((prevShow) => !prevShow);
  }, []);

  const changeStatus = useCallback(async () => {
    try {
      const response = await axios.get(`/auth/update_carstatus.php?id=${id}`);
      console.log(JSON.stringify(response.data));
      alert("Status Changed Successfully");
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
    }
  }, [id, navigation]);

  const handleSaveForLater = useCallback(() => {
    navigation.navigate("Draft");
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true on screen focus
      fetchCategories(); // Fetch categories
      fetchCheckCategories(); // Fetch check categories
    }, [id]) // Ensure dependencies are set correctly
  );

  return (
    <AppScreen>
      {show && (
        <ProcessModal
          show={show}
          setShow={setShow}
          icon
          heading={"Customer ID: 0KD560PLF"}
          text={"If you cancel the inspection, it will be saved as a draft"}
          pbtn={"Continue Inspection"}
          pbtnPress={ShowModal}
          sbtn={"Save for later"}
          sbtnPress={handleSaveForLater}
          sbtnColor={"#D20000"}
        />
      )}

      <View style={styles.headingContainer}>
        <AppText fontSize={12}>Inspection Board</AppText>
      </View>
      <ScrollView>
        <ImageBackground
          style={styles.customerSummarycontainerbackgroundImage}
          source={require("../../assets/componentsImages/summaryBackground.png")}
        >
          <View style={styles.customerSummarycontainer}>
            <View style={styles.customerDetailsAndLogout}>
              <View style={styles.customerDetails}>
                <AppText color={"white"} fontSize={12}>
                  Suzuki Mehran
                </AppText>
                <AppText color={"#BBBBBB"} fontSize={10}>
                  Customer: Saad Rehman
                </AppText>
              </View>
              <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                <View style={styles.timer}>
                  <Image
                    source={require("../../assets/componentsImages/timer.png")}
                  />
                  <View style={styles.time}>
                    <AppText color={"white"} fontSize={8}>
                      Time Left
                    </AppText>
                    <AppText color={"white"} fontSize={12}>
                      19:25
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.breakLine} />
            <View style={styles.summaryContainer}>
              <View style={styles.summaryBox}>
                <AppText color={"#cccccc"} fontSize={10}>
                  Mileage
                </AppText>
                <AppText color={"white"} fontSize={10}>
                  133319 km
                </AppText>
              </View>
              <View style={styles.summaryBox}>
                <AppText color={"#cccccc"} fontSize={10}>
                  Year
                </AppText>
                <AppText color={"white"} fontSize={10}>
                  2004
                </AppText>
              </View>
              <View style={styles.summaryBox}>
                <AppText color={"#cccccc"} fontSize={10}>
                  Color
                </AppText>
                <AppText color={"white"} fontSize={10}>
                  True Blue
                </AppText>
              </View>
              <View style={styles.summaryBox}>
                <AppText color={"#cccccc"} fontSize={10}>
                  Engine
                </AppText>
                <AppText color={"white"} fontSize={10}>
                  996 cc
                </AppText>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.InspectionBoardContainer}>
          <View style={styles.headingAndButton}>
            <View style={styles.headingWithIcon}>
              <AppText fontSize={12} color={"#323232"}>
                Inspection Details
              </AppText>
            </View>
            <IconButton
              onPress={ShowModal}
              icon={"cancel"}
              color={"#D70000"}
              fontSize={12}
            >
              Discard
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
              {categoriesList.map((item) => {
                const checkCategory = checkCategories.find(
                  (cat) => cat.catId === item.id
                );

                return (
                  <InspectionBoardCard
                    key={item.id}
                    name={item.category}
                    inspectionIsDone={
                      checkCategory ? checkCategory.inspectionIsDone : false
                    }
                    Rating={checkCategory ? checkCategory.Rating : ""}
                    onPress={() =>
                      navigation.navigate("SingleInspection", {
                        carid: id,
                        catid: item.id,
                        catName: item.category,
                      })
                    }
                  />
                );
              })}
              <View style={styles.inspectionButton}>
                <GradientButton
                  onPress={changeStatus}
                  disabled={!allInspectionsDone}
                >
                  Submit Inspection Report
                </GradientButton>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
});
