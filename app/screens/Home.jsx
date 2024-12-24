import {
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  DeviceEventEmitter, // Import DeviceEventEmitter
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import AppScreen from "../components/screen/Screen";
import InspectionCard from "../components/card/InspectionCard";
import AppText from "../components/text/Text";
import IconButton from "../components/buttons/IconButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import ToastManager from "toastify-react-native";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
import { colors } from "../constants/colors";
import { mainStyles } from "../constants/style";
import NetInfo from "@react-native-community/netinfo";
import UploadingInspectionCard from "../components/card/UploadingInspectionCard";
import { useFocusEffect } from "@react-navigation/native";
import { FormDataContext } from "../context/formDataContext";

const Home = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);
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

  const [fullData, setFullData] = useState([]);
  const [inspectedCar, setInspectedCar] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [carsInfos, setCarsInfos] = useState(false);

  useEffect(() => {
    if (userData && userData.user && userData.user.duserid) {
      carsInfoData();
      inspectedCarsData();
    }
  }, [userData.user.duserid]);

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

  // Fetch data from AsyncStorage
  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata" || []);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const draftData = parsedData.filter(
          (item) => item.status === "inspected"
        );
        setFullData(draftData);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Event listener to handle real-time updates from AsyncStorage
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("dataUpdated", () => {
      fetchDataFromAsyncStorage();
    });

    return () => {
      listener.remove(); // Clean up the listener
    };
  }, []);

  // Trigger event when AsyncStorage is updated
  // const updateAsyncStorage = async (newData) => {
  //   try {
  //     await AsyncStorage.setItem("@carformdata", JSON.stringify(newData));
  //     DeviceEventEmitter.emit("dataUpdated"); // Emit the event for changes
  //   } catch (error) {
  //     console.error("Error updating AsyncStorage", error);
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      fetchDataFromAsyncStorage(); // Fetch data when the screen is focused
    }, [])
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const userLogout = async () => {
    setUserData({ token: "", user: "" });
    await AsyncStorage.removeItem("@auth");
  };

  const inspectedCarsData = async () => {
    setLoading(true);
    setRefreshing(true);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `auth/get_carinspectionbasicInfo.php?startRecord=1&endRecord=10&duser_id=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setInspectedCar(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching inspected car data:", error);
      ToastManager.error(
        "Failed to fetch car data. Please Check Your Internet Connection"
      );
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  const carsInfoData = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `auth/get_duserinspections.php?duserid=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setCarsInfos(response.data);
    } catch (error) {
      console.log("Failed to Catch Car Infos:", error);
      ToastManager.error("Failed to Catch Car Infos");
    }
  };

  const reload = () => {
    carsInfoData();
    fetchDataFromAsyncStorage();
    inspectedCarsData();
  };

  console.log(carsInfos);

  return (
    <AppScreen>
      <ImageBackground
        style={styles.customerSummarycontainerbackgroundImage}
        source={require("../assets/componentsImages/summaryBackground.png")}
      >
        <View style={styles.customerSummarycontainer}>
          <View style={styles.customerDetailsAndLogout}>
            <View style={styles.customerDetails}>
              <AppText color={colors.fontWhite} fontSize={16}>
                {userData?.user?.dname}
              </AppText>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                User ID: {userData?.user?.duserid}
              </AppText>
              {/* <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Name: {userData?.user?.userName}
              </AppText> */}
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={userLogout}>
              <View style={styles.logOutButton}>
                <Image
                  source={require("../assets/componentsImages/logout.png")}
                />
                <AppText
                  color={colors.fontWhite}
                  fontSize={mainStyles.h4FontSize}
                >
                  Logout
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.breakLine} />
          <View style={styles.summaryContainer}>
            {/* <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Total
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                {carsInfos != "" ? carsInfos.total_evaluations : "--"}
              </AppText>
            </View> */}
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Pending
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                {carsInfos != "" ? carsInfos.total_pending : "--"}
              </AppText>
            </View>
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Approved
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                {carsInfos != "" ? carsInfos.total_inspected : "--"}
              </AppText>
            </View>
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Rejected
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                {carsInfos !== "" ? carsInfos.objections : "--"}
              </AppText>
            </View>
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Sold
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                {carsInfos !== "" ? carsInfos.total_sold : "--"}
              </AppText>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.recentInspectionContainer}>
        <View style={styles.headingAndButton}>
          <View style={styles.headingWithIcon}>
            <Image source={require("../assets/componentsImages/recent.png")} />
            <AppText fontSize={mainStyles.h2FontSize} color={"#323232"}>
              Recent Inspections
            </AppText>
          </View>
          <IconButton
            icon={"format-list-bulleted"}
            color={"#323232"}
            fontSize={mainStyles.h2FontSize}
            onPress={() => navigation.navigate("Reports")}
          >
            View All
          </IconButton>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: 280,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={reload} />
          }
        >
          {fullData.map((item) => (
            <UploadingInspectionCard
              key={item.tempID}
              carId={item?.tempID}
              car={getCarModel(item?.carId, item?.mfgId)}
              varient={getCarVarient(item?.varientId, item?.carId)}
              mileage={item?.mileage}
              date={item?.inspectionDate}
              carImage={item?.images[0]?.uri}
              onPress={() =>
                navigation.navigate("DraftSingleCar", { id: item?.tempID })
              }
            />
          ))}
          {isConnected ? (
            <View>
              {loading ? (
                Array(10)
                  .fill(0)
                  .map((_, index) => <SkeletonLoader key={index} />)
              ) : inspectedCar.length > 0 ? (
                inspectedCar.map((item) => (
                  <InspectionCard
                    key={item?.inpsectionid}
                    carId={item?.inpsectionid}
                    car={item?.carName}
                    varient={item?.varientId}
                    mileage={item?.mileage}
                    date={item?.inspection_date}
                    carImage={item?.carimage}
                    rank={item?.rating}
                    onPress={() =>
                      navigation.navigate("SingleCar", {
                        id: item?.inpsectionid,
                        rating: item?.rating,
                      })
                    }
                  />
                ))
              ) : (
                <View
                  style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AppText>You don't have any inspections.</AppText>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                height: 400,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppText maxWidth={350}>
                You Don't Have Internet Connection To See Data.
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  customerSummarycontainerbackgroundImage: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  customerSummarycontainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
  customerDetailsAndLogout: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  customerDetails: {
    gap: 5,
  },
  logOutButton: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
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
    gap: 5,
  },
  recentInspectionContainer: {
    marginTop: 20,
  },
  headingAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headingWithIcon: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
