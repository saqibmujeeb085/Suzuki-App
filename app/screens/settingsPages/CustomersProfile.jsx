import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import { AuthContext } from "../../context/authContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AppText from "../../components/text/Text";
import { colors } from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import SkeletonLoader from "../../components/skeletonLoader/SkeletonLoader";
import { mainStyles } from "../../constants/style";

const CustomersProfile = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(true); // Initially assume the device is connected
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchCustomerData(); // Fetch data if the device is connected
    } else {
      setLoading(false); // Stop loading if there's no internet connection
    }
  }, [isConnected]);

  // Function to fetch customer data using axios and async/await
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `/auth/get_customers.php?duser_id=${userData.user.duserid}`
      );
      setCustomerData(response.data); // Set the customer data from the API
      setLoading(false); // Set loading to false when the data is fetched
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError("Failed to load customer data");
      setLoading(false); // Stop loading in case of an error
    }
  };

  if (!isConnected) {
    return (
      <AppScreen>
        <InspectionHeader>Customers Profile</InspectionHeader>
        <View style={styles.centeredContainer}>
          <AppText fontSize={mainStyles.h1FontSize} color={"#323232"}>
            You need an internet connection to see Customers.
          </AppText>
        </View>
      </AppScreen>
    );
  }

  if (loading) {
    return (
      <AppScreen>
        <InspectionHeader onPress={() => navigation.goBack()}>
          Customers Profile
        </InspectionHeader>
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
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen>
        <InspectionHeader onPress={() => navigation.goBack()}>
          Customers Profile
        </InspectionHeader>
        <View style={{ padding: 20 }}>
          <AppText fontSize={mainStyles.h1FontSize} color={"#323232"}>
            {error}
          </AppText>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Customers Profile
      </InspectionHeader>
      <ScrollView style={{ marginBottom: 30, flex: 1 }}>
        <View
          style={{
            gap: 10,
            paddingHorizontal: 20,
            flex: 1,
            paddingBottom: 20,
          }}
        >
          {customerData && customerData.length === 0 ? (
            <AppText fontSize={mainStyles.h1FontSize} color={"#323232"}>
              You Don't Have Any Customers Yet.
            </AppText>
          ) : (
            customerData.map((customer) => (
              <View
                key={customer.customerId}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 20,
                  borderRadius: 10,
                  elevation: 2,
                  backgroundColor: colors.whiteBg,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.purple,
                      padding: 10,
                      height: 50,
                      width: 50,
                      borderRadius: 200,
                      elevation: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      name="user"
                      size={20}
                      color={colors.whiteBg}
                    />
                  </View>
                  <View style={{ gap: 5 }}>
                    <AppText>Name: {customer.name}</AppText>
                    <AppText>CNIC: {customer.cnic}</AppText>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.IconButton}
                    activeOpacity={0.6}
                  >
                    <MaterialCommunityIcons
                      name={"eye-outline"}
                      size={25}
                      color={colors.purple}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default CustomersProfile;

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.ligtGreyBg,
    height: "80%",
    paddingRight: 10,
    paddingLeft: 25,
  },
  IconButton: {
    marginRight: 10,
    padding: 8,
  },
});
