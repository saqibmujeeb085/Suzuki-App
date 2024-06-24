import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
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

const Home = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [inspectedCar, setInspectedCar] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log(userData);

  useEffect(() => {
    inspectedCar.forEach((item) => {
      if (item.images && item.images.length > 0) {
        console.log(item.images[0].path);
      }
    });
  }, [inspectedCar]);

  useEffect(() => {
    if (userData && userData.user && userData.user.duserid) {
      inspectedCarsData();
    }
  }, [userData.user.duserid]);

  const userLogout = async () => {
    setUserData({ token: "", user: "" });
    await AsyncStorage.removeItem("@auth");
    // alert("Logout Successfully");
  };

  const inspectedCarsData = async () => {
    setRefreshing(true);
    let config = {
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
      Toast.error(
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
              paddingBottom: 30,
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
                model={item?.model}
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
    </AppScreen>
  );
};

export default Home;

const styles = StyleSheet.create({
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
});
