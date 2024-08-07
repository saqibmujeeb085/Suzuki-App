import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const UploadingInspectionCard = ({
  carId,
  car,
  mileage,
  date,
  varient,
  carImage,
  onPress,
}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.inspectionDestailsContainer}>
        <Image source={{ uri: carImage }} style={styles.image} />
        <View style={styles.contentContainer}>
          <AppText
            color={colors.fontBlack}
            fontSize={mainStyles.h2FontSize}
            textTransform={"capitalize"}
          >
            {car}
          </AppText>
          <View style={styles.clientAndCarDetail}>
            <AppText color={colors.fontBlack} fontSize={mainStyles.h4FontSize}>
              Varient: {varient}
            </AppText>

            <AppText color={colors.fontBlack} fontSize={mainStyles.h4FontSize}>
              Mileage: {mileage}
            </AppText>
          </View>
          <AppText color={colors.fontGrey} fontSize={mainStyles.h4FontSize}>
            {date}
          </AppText>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {/* <MaterialCommunityIcons
          style={styles.IconButton}
          name={"eye-outline"}
          size={25}
          color={colors.blueColor}
        /> */}
        <ActivityIndicator size={35} color={colors.blue} />
        <MaterialIcons
          name="file-upload"
          size={20}
          style={{ position: "absolute", left: 32, top: 22 }}
          color={colors.blue}
        />
      </View>
    </View>
  );
};

export default UploadingInspectionCard;

const styles = StyleSheet.create({
  Container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    elevation: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  inspectionDestailsContainer: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  image: {
    width: mainStyles.CardImageSize,
    height: mainStyles.CardImageSize,
    resizeMode: "cover",
    borderRadius: 4,
    overflow: "hidden",
  },
  contentContainer: {
    justifyContent: "center",
    flexDirection: "column",
    paddingVertical: 5,
    gap: 5,
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
  },
});
