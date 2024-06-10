import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import AppScreen from "../components/screen/Screen";
import Search from "../components/search/Search";
import AppText from "../components/text/Text"
import IconButton from "../components/buttons/IconButton";
import InspectionCard from "../components/card/InspectionCard";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
import axios from "axios";
import { AuthContext } from "../context/authContext";


const Reports = () => {
  
  const [userData, setUserData] = useContext(AuthContext);
  const [inspectedCar, setInspectedCar] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (userData && userData.user && userData.user.duserid) {
      inspectedCarsData();
    }
  }, [userData.user.duserid]);


  const inspectedCarsData = async () => {
    setRefreshing(true);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `/auth/get_carinfos.php?duserId=${userData.user.duserid}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setInspectedCar(response.data.slice(0, 20));
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching inspected car data:', error);
      Toast.error('Failed to fetch car data. Please Check Your Internet Connection');
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <AppScreen>
    <View style={styles.reportSearchBox}>
      <AppText textAlign={'center'} fontSize={12} color={"#1d1d1d"} >Search Inspection Reports</AppText>
      <Search />
      </View>
    
      <View style={styles.searchDataContainer}>
        <View style={styles.headingAndButton}>
          
          
            <AppText fontSize={12} color={"#323232"}>
            Search Result
            </AppText>
          
          <IconButton icon={"filter-outline"} color={"#323232"} fontSize={12}>
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
        style={{ marginTop: 20, marginBottom: 140 }}
      />
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20, marginBottom: 140 }}
          data={inspectedCar}
          extraData={inspectedCar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <InspectionCard
              carId={item?.id}
              car={item?.car}
              customer={item?.customerName}
              model={item?.model}
              date={item?.inspectionDate}
              carImage={item?.carPic}
              rank={item?.rank}
              onPress={() => navigation.navigate('SingleCar', { id: item?.id })}
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

export default Reports;

const styles = StyleSheet.create({
  reportSearchBox: {
    padding: 20,
    gap: 20
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
});
