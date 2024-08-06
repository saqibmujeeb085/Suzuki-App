import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppScreen from "../components/screen/Screen";
import AppText from "../components/text/Text";
import DraftInspectionCard from "../components/card/DraftInspectionCard";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
import { mainStyles } from "../constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InspectionHeader from "../components/header/InspectionHeader";
import { FormDataContext } from "../context/formDataContext";

const Drafts = ({ navigation }) => {
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
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const getManufacturer = (manufacturerId) => {
    if (manufacturersData) {
      const m = manufacturersData.find((item) => item.key === manufacturerId);
      return m ? m.value : "Unknown Manufacturer";
    }
  };

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

  // Function to fetch data from AsyncStorage
  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata" || []);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const draftData = parsedData.filter((item) => item.status === "draft");
        setFullData(draftData);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Using useFocusEffect to fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDataFromAsyncStorage(); // Refresh when screen is focused
    }, [])
  );

  return (
    <AppScreen>
      <View style={styles.recentInspectionContainer}>
        <View style={styles.headingAndButton}>
          <InspectionHeader backIcon={false}>
            Draft Inspections
          </InspectionHeader>
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
        ) : fullData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <AppText fontSize={mainStyles.h1FontSize} color={"#323232"}>
              No Data Found In Draft
            </AppText>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 60,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 0, marginBottom: 30 }}
            data={fullData}
            extraData={fullData}
            keyExtractor={(item) => item.tempID.toString()}
            renderItem={({ item }) => (
              <DraftInspectionCard
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
            )}
            refreshing={refreshing}
            onRefresh={fetchDataFromAsyncStorage}
            ListFooterComponent={loading && <SkeletonLoader />}
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
    marginTop: 0,
  },
  headingAndButton: {
    flexDirection: "row",
    justifyContent: "center", // Centered
    alignItems: "center",
    paddingHorizontal: 0,
  },
  pageHeading: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
