import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

import AppScreen from "../components/screen/Screen";
import Search from "../components/search/Search";
import AppText from "../components/text/Text"
import IconButton from "../components/buttons/IconButton";
import InspectionCard from "../components/card/InspectionCard";


const Reports = () => {
  return (
    <AppScreen>
    {/* <View style={styles.reportSearchBox}>
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
        <FlatList
          style={{ marginTop: 10, marginBottom: 170 }}
          data={recentInspectionData}
          keyExtractor={(recentInspectionData) =>
            recentInspectionData.id.toString()
          }
          renderItem={({ item }) => (
            <InspectionCard
              car={item.car}
              customer={item.customet}
              model={item.model}
              date={item.dateTime}
              carImage={item.carimage}
            />
          )}
        />
      </View> */}
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
