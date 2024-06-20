import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppScreen from "../components/screen/Screen";
import AppText from "../components/text/Text";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import DraftInspectionCard from "../components/card/DraftInspectionCard";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
import { mainStyles } from "../constants/style";

const Drafts = ({ navigation }) => {
  const [userData] = useContext(AuthContext);
  const [fullData, setFullData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;


  // Function to fetch inspected cars data
  const fetchInspectedCars = useCallback(
    async (hardRefresh = false) => {
      if (hardRefresh) {
        setFullData([]); // Clear the cache for a hard refresh
        setPage(1); // Reset the page to 1 for a hard refresh
      }
      setRefreshing(true); // Start refreshing
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `auth/get_carinfosdraft.php?id=${userData.user.duserid}`, // Ensure the correct URL is used
        headers: {},
      };
      try {
        const response = await axios.request(config);
        setFullData(response.data);
        setDisplayData(response.data.slice(0, itemsPerPage));
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
      fetchInspectedCars(); // Hard refresh when screen is focused
    }, [fetchInspectedCars])
  );

  const loadMoreData = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = nextPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const moreData = fullData.slice(startIndex, endIndex);

    setDisplayData((prev) => [...prev, ...moreData]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <AppScreen>
      <View style={styles.recentInspectionContainer}>
        <View style={styles.headingAndButton}>
          <AppText fontSize={mainStyles.h1FontSize} color={"#323232"}>
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
            style={{ marginTop: 20, marginBottom: 30 }}
          />
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 30,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20, marginBottom: 30 }}
            data={displayData}
            extraData={displayData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DraftInspectionCard
                carId={item?.id}
                car={item?.car}
                varient={item?.varientId}
                model={item?.model}
                date={item?.inspectionDate}
                carImage={item?.images[0]?.path}
                onPress={() =>
                  navigation.navigate("DraftSingleCar", { id: item?.id })
                }
              />
            )}
            refreshing={refreshing}
            onRefresh={() => fetchInspectedCars(true)}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <SkeletonLoader /> : null}
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
