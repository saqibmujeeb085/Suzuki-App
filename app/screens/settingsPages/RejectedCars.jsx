import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import InspectionHeader from "../../components/header/InspectionHeader";
import { AuthContext } from "../../context/authContext";
import InspectionCard from "../../components/card/InspectionCard";
import NetInfo from "@react-native-community/netinfo";
import SkeletonLoader from "../../components/skeletonLoader/SkeletonLoader";
import axios from "axios";

const RejectedCars = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [inspectedCar, setInspectedCar] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  console.log(inspectedCar);

  const RejectedCarsData = async () => {
    setLoading(true);
    setRefreshing(true);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `auth/get_carrejected.php?duser_id=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      console.log(response);
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

  useEffect(() => {
    RejectedCarsData();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const reload = () => {
    RejectedCarsData();
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Rejected Cars
      </InspectionHeader>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 280,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reload} />
        }
      >
        {isConnected ? (
          <View>
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, index) => <SkeletonLoader key={index} />)
            ) : inspectedCar.length > 0 ? (
              inspectedCar.map((item) => (
                <InspectionCard
                  key={item?.inpsectionid || index} // Handle undefined key case
                  carId={item?.inpsectionid}
                  car={item?.carName}
                  variant={item?.varientId} // Correct typo if necessary
                  mileage={item?.mileage}
                  date={item?.inspection_date}
                  carImage={item?.carimage}
                  rank={item?.rating}
                  onPress={() => {
                    // Add navigation logic here if needed
                  }}
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
                <AppText>You don't have any Rejected Cars.</AppText>
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
              You Don&apos;t Have Internet Connection To See Data.
            </AppText>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
};

export default RejectedCars;

const styles = StyleSheet.create({});
