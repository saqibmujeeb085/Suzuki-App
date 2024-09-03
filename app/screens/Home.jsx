import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { FormDataContext } from "../context/formDataContext";
import { QuesAndAnsContext } from "../context/questionAndCategories";
import NetInfo from "@react-native-community/netinfo";

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
  const [categories, setCategories, questions, setQuestions] =
    useContext(QuesAndAnsContext);

  const [inspectedCar, setInspectedCar] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // for form data
  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchManufacturers(),
        fetchCarModel(),
        fetchCarVarient(),
        fetchCarYears(),
        fetchCarColors(),
        fetchFuelTypes(),
        fetchTransmissionsTypes(),
        fetchEngineCapacity(),
        fetchRegistrationCity(),
      ]);
      // setDataLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userData && userData.user && userData.user.duserid) {
      inspectedCarsData();
    }
  }, [userData.user.duserid]);

  // for logout
  const userLogout = async () => {
    setUserData({ token: "", user: "" });
    await AsyncStorage.removeItem("@auth");
  };

  // for form data
  const fetchManufacturers = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_carmanufacturer.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const ManufacturerNames = response.data;
      setManufacturersData(
        ManufacturerNames.map((object) => ({
          key: object.id,
          value: object.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const fetchCarModel = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_carlistnew.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const ModelNames = response.data;

      const transformedList = ModelNames.reduce((acc, Model) => {
        acc[Model.manufacturerID] = Model.carlistData.map((car) => ({
          key: car.carID,
          value: car.carName,
        }));
        return acc;
      }, {});
      setModelsData(transformedList);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const fetchCarVarient = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_cartypenew.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const VarientNames = response.data;

      const transformedList = VarientNames.reduce((acc, varient) => {
        acc[varient.carID] = varient.cartypeData.map((v) => ({
          key: v.typeID,
          value: v.TypeName,
        }));
        return acc;
      }, {});
      setVarientsData(transformedList);
    } catch (error) {
      console.error("Error fetching car variants:", error);
    }
  };

  const fetchCarYears = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_caryears.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const years = response.data;

      const transformedList = years.reduce((acc, year) => {
        acc[year.carID] = year.carYearData.map((y) => ({
          key: y.YearId,
          value: y.Year,
        }));
        return acc;
      }, {});
      setYearsData(transformedList);
    } catch (error) {
      console.error("Error fetching car years:", error);
    }
  };

  const fetchCarColors = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_color.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const CarColors = response.data;
      setColorsData(
        CarColors.map((object) => ({
          key: object.id,
          value: object.color,
        }))
      );
    } catch (error) {
      console.error("Error fetching car colors:", error);
    }
  };

  const fetchFuelTypes = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_fuelType.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const FuelTypes = response.data;
      setFuelsData(
        FuelTypes.map((object) => ({
          key: object.did,
          value: object.type,
        }))
      );
    } catch (error) {
      console.error("Error fetching fuel types:", error);
    }
  };

  const fetchTransmissionsTypes = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_cartrans.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const TransmissionsTypes = response.data;
      setTransmissionsData(
        TransmissionsTypes.map((object) => ({
          key: object.did,
          value: object.type,
        }))
      );
    } catch (error) {
      console.error("Error fetching transmission types:", error);
    }
  };

  const fetchEngineCapacity = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_engdis.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const EngineCapacity = response.data;
      setCapacitiesData(
        EngineCapacity.map((object) => ({
          key: object.id,
          value: object.displacement,
        }))
      );
    } catch (error) {
      console.error("Error fetching engine capacities:", error);
    }
  };

  const fetchRegistrationCity = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_cities.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const RegistrationCity = response.data;
      setCitiesData(
        RegistrationCity.map((object) => ({
          key: object.id,
          value: object.city,
        }))
      );
    } catch (error) {
      console.error("Error fetching registration cities:", error);
    }
  };

  // for car data
  const inspectedCarsData = async () => {
    setRefreshing(true);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_carinfos.php?duserId=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setInspectedCar(response.data.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inspected car data:", error);
      ToastManager.error(
        "Failed to fetch car data. Please Check Your Internet Connection"
      );
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

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
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Name: {userData?.user?.userName}
              </AppText>
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
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Registrations
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                2,000K
              </AppText>
            </View>
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Purchases
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                1,500
              </AppText>
            </View>
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Sales
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                1,200
              </AppText>
            </View>
            <View style={styles.summaryBox}>
              <AppText color={"#cccccc"} fontSize={mainStyles.h3FontSize}>
                Downloads
              </AppText>
              <AppText
                color={colors.fontWhite}
                fontSize={mainStyles.h1FontSize}
              >
                10,23
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
        {isConnected ? (
          <View>
            {loading ? (
              <FlatList
                data={Array(10).fill(0)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={() => <SkeletonLoader />}
                contentContainerStyle={{
                  paddingBottom: 30,
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginBottom: 190 }}
              />
            ) : (
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 90,
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginBottom: 190 }}
                data={inspectedCar}
                extraData={inspectedCar}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <InspectionCard
                    carId={item?.id}
                    car={item?.car}
                    varient={item?.varientId}
                    mileage={item?.mileage}
                    date={item?.inspectionDate}
                    carImage={item?.images[0]?.path}
                    rank={item?.rank}
                    onPress={() =>
                      navigation.navigate("SingleCar", { id: item?.id })
                    }
                  />
                )}
                refreshing={refreshing}
                onRefresh={inspectedCarsData}
              />
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
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customerSummarycontainerbackgroundImage: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
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
  // other styles...
});

export default Home;
