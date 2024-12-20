import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchConatiner}>
      <View style={styles.search}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.fontGrey} />
        <TextInput
          autoComplete="off"
          placeholderTextcolor={colors.fontGrey}
          style={styles.searchInput}
          placeholder="Search report Here"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchConatiner: {
    padding: 20,
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  search: {
    flexDirection: "row",
    gap: 10,
    width: "80%",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
});
