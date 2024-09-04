import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const ShowModal = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (userData && userData.user && userData.user.duserid) {
      inspectedCarsData();
    }
  }, [userData.user.duserid]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchFilteredData();
    } else {
      <AppText>No Data Found</AppText>;
    }
  }, [filters]);

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
      setInspectedCar(response.data.slice(0, 20));
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

  const fetchSearchResults = async () => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_search.php?query=${searchQuery}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      Toast.error(
        "Failed to fetch search results. Please Check Your Internet Connection"
      );
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    setLoading(true);
    const { carYear, carColor, startDate, endDate, manufacturer, carModel } =
      filters;
    let url = `/auth/get_filters.php?`;
    if (carYear) url += `model=${carYear}&`;
    if (carColor) url += `color=${carColor}&`;
    if (startDate)
      url += `start_date=${startDate.toISOString().split("T")[0]}&`;
    if (endDate) url += `end_date=${endDate.toISOString().split("T")[0]}&`;
    if (manufacturer) url += `manufacturer=${manufacturer}&`;
    if (carModel) url += `car_name=${carModel}&`;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setInspectedCar(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      Toast.error(
        "Failed to fetch filtered data. Please Check Your Internet Connection"
      );
      setLoading(false);
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

  const dataToDisplay =
    searchQuery.trim().length > 0 ? searchResults : inspectedCar;

  return (
    <AppScreen>
      {show && (
        <FilterModal show={show} setShow={setShow} onFilter={onFilter} />
      )}
      {/* <View style={styles.reportSearchBox}>
        <AppText textAlign={"center"} fontSize={12} color={"#1d1d1d"}>
          Inspection Reports
        </AppText>
      </View> */}
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
      {isConnected ? (
        <View style={styles.searchDataContainer}>
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
              style={{ marginTop: 20, marginBottom: 170 }}
            />
          ) : dataToDisplay.length === 0 && Object.keys(filters).length > 0 ? (
            <View style={styles.noDataContainer}>
              <AppText>No Data Found With This Filter</AppText>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 30,
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 20, marginBottom: 180 }}
              data={dataToDisplay}
              extraData={dataToDisplay}
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
  searchDataContainer: {
    marginTop: 5,
  },
  headingAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
  },
});
