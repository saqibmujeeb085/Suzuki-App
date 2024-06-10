import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppScreen from "../components/screen/Screen";
import AppText from "../components/text/Text";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import DraftInspectionCard from "../components/card/DraftInspectionCard";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";

const Drafts = ({ navigation }) => {
  const [userData] = useContext(AuthContext);
  const [inspectedCar, setInspectedCar] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch inspected cars data
  const fetchInspectedCars = useCallback(
    async (hardRefresh = false) => {
      if (hardRefresh) {
        setInspectedCar([]); // Clear the cache for a hard refresh
      }
      setRefreshing(true); // Start refreshing
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `auth/get_carinfosdraft.php?duserId=${userData.user.duserid}`, // Ensure the correct URL is used
        headers: {},
      };
      try {
        const response = await axios.request(config);
        console.log(response.data);
        setInspectedCar(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setRefreshing(false); // Stop refreshing
        setLoading(false); // Set loading to false after fetching data
      }
    },
    [userData]
  );

  // Using useFocusEffect to fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchInspectedCars(true); // Hard refresh when screen is focused
    }, [fetchInspectedCars])
  );

  // Load data from state initially and clear cache
  useEffect(() => {
    setLoading(true); // Set loading to true
    fetchInspectedCars(); // Fetch fresh data
  }, []);

  

  return (
    <AppScreen>
      <View style={styles.recentInspectionContainer}>
        <View style={styles.headingAndButton}>
          <AppText fontSize={14} color={"#323232"}>
            Draft Inspections
          </AppText>
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
        style={{ marginTop: 20, marginBottom: 80 }}
      />
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20, marginBottom: 80 }}
          data={inspectedCar}
          extraData={inspectedCar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DraftInspectionCard
              carId={item?.id}
              car={item?.car}
              customer={item?.customerName}
              model={item?.model}
              date={item?.inspectionDate}
              carImage={item?.carPic}
              onPress={() =>
                navigation.navigate("DraftSingleCar", { id: item?.id })
              }
            />
          )}
          refreshing={refreshing}
          onRefresh={() => fetchInspectedCars(true)}
        />
      )}
      </View>
    </AppScreen>
  );
};

export default Drafts;

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
    justifyContent: "center", // Centered
    alignItems: "center",
    paddingHorizontal: 20,
  },
  pageHeading: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
