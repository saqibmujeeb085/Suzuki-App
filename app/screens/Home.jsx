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
import NetInfo from "@react-native-community/netinfo";

const Home = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);

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

  // for car data
  const inspectedCarsData = async () => {
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
                keyExtractor={(item) => item.inpsectionid.toString()}
                renderItem={({ item }) => (
                  <InspectionCard
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
