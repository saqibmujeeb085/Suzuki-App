import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl, // Import RefreshControl
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../components/screen/Screen";
import Search from "../components/search/Search";
import AppText from "../components/text/Text";
import IconButton from "../components/buttons/IconButton";
import InspectionCard from "../components/card/InspectionCard";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import FilterModal from "../components/modals/FilterModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import InspectionHeader from "../components/header/InspectionHeader";

const Reports = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [inspectedCar, setInspectedCar] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false); // State to track refreshing
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);

  // New states for pagination
  const [startRecord, setStartRecord] = useState(1);
  const [endRecord, setEndRecord] = useState(20); // Initially fetch 1 to 20 records
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Track if search is active

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const ShowModal = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (userData && userData.user && userData.user.duserid && !isSearching) {
      inspectedCarsData();
    }
  }, [userData.user.duserid, startRecord, endRecord]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setIsSearching(false); // Reset search status when query is cleared
    }
  }, [searchQuery, startRecord, endRecord]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchFilteredData();
    }
  }, [filters]);

  const inspectedCarsData = async () => {
    setRefreshing(true);
    setLoading(true);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `auth/get_carinspectionbasicInfo.php?startRecord=${startRecord}&endRecord=${endRecord}&duser_id=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const newCars = response.data;

      // Check if response contains an error message
      if (newCars?.message) {
        console.log("Error fetching inspected car data:", newCars.message);
        setInspectedCar([]); // Set empty array if there's an error message
      } else if (Array.isArray(newCars)) {
        // Ensure the response is an array
        if (startRecord === 1) {
          setInspectedCar(newCars); // Set initial data
        } else {
          setInspectedCar((prevCars) => [...prevCars, ...newCars]); // Append new data
        }
      } else {
        console.log("Unexpected data format:", newCars);
        setInspectedCar([]); // Set empty array if the response is not an array
      }

      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.log("Error fetching inspected car data:", error);
      console.log(
        "Failed to fetch car data. Please Check Your Internet Connection"
      );
      setLoading(false);
      setInspectedCar([]); // Set empty array to prevent map error
    } finally {
      setRefreshing(false); // Stop refreshing after data is fetched
    }
  };

  const fetchSearchResults = async () => {
    setIsSearching(true);
    setLoading(true);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `auth/get_search.php?query=${searchQuery}&startRecord=${startRecord}&endRecord=${endRecord}&duser_id=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const newSearchResults = response.data;

      // Check if response contains an error message
      if (newSearchResults?.message) {
        setSearchResults([]); // Set empty array if there's an error message
      } else if (Array.isArray(newSearchResults)) {
        if (startRecord === 1) {
          setSearchResults(newSearchResults); // Set search data
        } else {
          setSearchResults((prevResults) => [
            ...prevResults,
            ...newSearchResults,
          ]);
        }
      } else {
        setSearchResults([]);
      }

      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      setLoading(false);
      setSearchResults([]); // Set empty array to prevent map error
    }
  };

  const fetchFilteredData = async () => {
    setLoading(true);

    const { carYear, carColor, startDate, endDate, manufacturer, carModel } =
      filters;

    let url = `/auth/get_filters.php?duser_id=${userData.user.duserid}&startRecord=${startRecord}&endRecord=${endRecord}`;

    // Add filters to the URL
    if (carYear) url += `&model=${carYear}`;
    if (carColor) url += `&color=${carColor}`;
    if (startDate)
      url += `&start_date=${startDate.toISOString().split("T")[0]}`;
    if (endDate) url += `&end_date=${endDate.toISOString().split("T")[0]}`;
    if (manufacturer) url += `&manufacturer=${manufacturer}`;
    if (carModel) url += `&car_name=${carModel}`;

    try {
      const response = await axios.get(url);

      const filteredData = response.data;

      // Check for any error message in the response and handle it
      if (filteredData?.message) {
        setInspectedCar([]);
      } else {
        setInspectedCar(Array.isArray(filteredData) ? filteredData : []);
      }

      setLoading(false);
    } catch (error) {
      console.log("Error fetching filtered data:", error);
      setLoading(false);
      setInspectedCar([]); // Set empty array to prevent map error
    }
  };

  const onFilter = (filters) => {
    setFilters(filters);
    const filterArray = [];
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        let value = filters[key];
        if (key === "startDate" || key === "endDate") {
          value = formatDate(value);
        }
        filterArray.push({ key, value });
      }
    });
    setSelectedFilters(filterArray);
  };

  const clearFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    const newSelectedFilters = selectedFilters.filter(
      (filter) => filter.key !== key
    );
    setSelectedFilters(newSelectedFilters);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const loadMoreCars = () => {
    const dataLength = isSearching ? searchResults.length : inspectedCar.length;
    if (!isLoadingMore && dataLength >= endRecord) {
      setIsLoadingMore(true);
      setStartRecord((prev) => prev + 20);
      setEndRecord((prev) => prev + 20);
    }
  };

  const onScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isCloseToBottom && !isLoadingMore) {
      loadMoreCars(); // Load more data when reaching the bottom
    }
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true); // Show refresh loader
    setStartRecord(1); // Reset start record for fresh data
    setEndRecord(20); // Reset end record
    await inspectedCarsData(); // Re-fetch data
    setRefreshing(false); // Stop refresh loader
  };

  const dataToDisplay =
    searchQuery.trim().length > 0 ? searchResults : inspectedCar;

  return (
    <AppScreen>
      {isConnected ? (
        <View style={styles.searchDataContainer}>
          <InspectionHeader backIcon={false} borderBottom={true}>
            Inspection Reports
          </InspectionHeader>

          <View style={styles.reportSearchBox}>
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </View>

          <View style={styles.filterChips}>
            {selectedFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={styles.filterChip}
                onPress={() => clearFilter(filter.key)}
              >
                <AppText>{`${filter.value}`}</AppText>
                <MaterialCommunityIcons name="close" size={14} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.headingAndButton}>
            <AppText fontSize={12} color={"#323232"}>
              {searchQuery.trim().length > 0 ? "Search Result" : "All Reports"}
            </AppText>
            <IconButton
              icon={"filter-outline"}
              color={"#323232"}
              fontSize={12}
              onPress={ShowModal}
            >
              Filter
            </IconButton>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 180 }}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll} // Load more on scroll
            scrollEventThrottle={400}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Pull-to-refresh control
            }
          >
            {/* Ensure that `dataToDisplay` is always an array before using .map */}
            {loading && startRecord === 1 ? (
              Array(10)
                .fill(0)
                .map((_, index) => <SkeletonLoader key={index} />)
            ) : Array.isArray(dataToDisplay) && dataToDisplay.length > 0 ? (
              dataToDisplay.map((item, index) => (
                <InspectionCard
                  key={index}
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
              <View style={styles.noDataContainer}>
                <AppText>No Data Found</AppText>
              </View>
            )}

            {isLoadingMore && (
              <View style={styles.loadingContainer}>
                <AppText>LOADING...</AppText>
              </View>
            )}
          </ScrollView>
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

      {show && (
        <FilterModal show={show} setShow={setShow} onFilter={onFilter} />
      )}
    </AppScreen>
  );
};

export default Reports;

const styles = StyleSheet.create({
  reportSearchBox: {
    padding: 20,
    paddingTop: 0,
    gap: 20,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    gap: 5,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headingAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
