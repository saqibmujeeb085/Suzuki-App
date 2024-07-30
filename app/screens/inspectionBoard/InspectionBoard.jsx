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
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import InspectionHeader from "../../components/header/InspectionHeader";

const InspectionBoard = ({ navigation, route }) => {
  const { id } = route.params || {};

  console.log(id);

  const [categoriesList, setCategoriesList] = useState([]);
  const [checkCategories, setCheckCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [allInspectionsDone, setAllInspectionsDone] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading to true
  const [carInfo, setCarInfo] = useState(null);

  useEffect(() => {
    if (!id) {
      setError(new Error("No ID provided"));
      setLoading(false);
      return;
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_singledraftcarinfos.php?id=${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setCarInfo(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

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
      setLoading(false); // Ensure loading is set to false after fetching data
    } catch (error) {
      console.error(error);
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
      const response = await axios.get(
        `/auth/update_carstatus.php?carid=${id}`
      );
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

  const catIcons = [
    {
      id: "1",
      icon: "steering",
    },
    {
      id: "2",
      icon: "car",
    },
    {
      id: "3",
      icon: "car-clutch",
    },
    {
      id: "4",
      icon: "car-door",
    },
    {
      id: "5",
      icon: "engine-outline",
    },
    {
      id: "6",
      icon: "car-brake-worn-linings",
    },
    {
      id: "7",
      icon: "tools",
    },
    {
      id: "8",
      icon: "car-side",
    },
  ];

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

      {/* <View style={styles.headingContainer}>
        <AppText fontSize={mainStyles.h2FontSize}>Inspection Board</AppText>
      </View> */}
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
                  {carInfo?.mfgId} {carInfo?.car}
                </AppText>
                <AppText
                  color={colors.fontGrey}
                  fontSize={mainStyles.h3FontSize}
                >
                  Varient: {carInfo?.varientId}
                </AppText>
              </View>
              <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
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
              </TouchableOpacity>
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
              {categoriesList.map((item) => {
                const checkCategory = checkCategories.find(
                  (cat) => cat.catId === item.id
                );

                console.log(checkCategory);

                const checkIcon = catIcons.find((icon) => icon.id === item.id);
                console.log(checkIcon);
                return (
                  <InspectionBoardCard
                    key={item.id}
                    name={item.category}
                    inspectionIsDone={
                      checkCategory ? checkCategory.inspectionIsDone : false
                    }
                    Rating={checkCategory ? checkCategory.Rating : ""}
                    icon={checkIcon?.icon}
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
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton onPress={changeStatus} disabled={!allInspectionsDone}>
          Submit Inspection Report
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
