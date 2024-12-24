import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppScreen from "../components/screen/Screen";
import AppText from "../components/text/Text";
import { mainStyles } from "../constants/style";
import { colors } from "../constants/colors";
import InspectionHeader from "../components/header/InspectionHeader";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Settings = ({ navigation }) => {
  return (
    <AppScreen>
      <InspectionHeader backIcon={false}>App Settings</InspectionHeader>
      <ScrollView style={{ marginBottom: 30, flex: 1 }}>
        <View
          style={{ gap: 10, paddingHorizontal: 20, flex: 1, paddingBottom: 20 }}
        >
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("PendingCars")}
          >
            <View style={styles.btnDesign}>
              <MaterialCommunityIcons
                name="car-clock"
                size={30}
                color={colors.purple}
              />
              <AppText>Pending Cars</AppText>
            </View>
            <AntDesign name="arrowright" size={24} color={colors.fontBlack} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("RejectedCars")}
          >
            <View style={styles.btnDesign}>
              <MaterialCommunityIcons
                name="car-off"
                size={30}
                color={colors.purple}
              />
              <AppText>Rejected Cars</AppText>
            </View>
            <AntDesign name="arrowright" size={24} color={colors.fontBlack} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("SoldCars")}
          >
            <View style={styles.btnDesign}>
              <MaterialCommunityIcons
                name="car"
                size={30}
                color={colors.purple}
              />
              <AppText>Sold Cars</AppText>
            </View>
            <AntDesign name="arrowright" size={24} color={colors.fontBlack} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("CustomersProfile")}
          >
            <View style={styles.btnDesign}>
              <FontAwesome5
                name="address-card"
                size={30}
                color={colors.purple}
              />

              <AppText>Customers Profile</AppText>
            </View>
            <AntDesign name="arrowright" size={24} color={colors.fontBlack} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default Settings;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    backgroundColor: colors.whiteBg,
    elevation: 2,
    borderRadius: 5,
    gap: 20,
  },
  btnDesign: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
