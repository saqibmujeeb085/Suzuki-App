import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { mainStyles } from "../../constants/style";

const InspectionCard = ({
  car,
  model,
  date,
  customer,
  carImage,
  rank,
  onPress,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.Container}>
        <View style={styles.inspectionDestailsContainer}>
          <Image
            source={{ uri: `${process.env.IMAGE_URL}/${carImage}` }}
            style={styles.image}
          />
          <View style={styles.contentContainer}>
            <AppText color={colors.fontBlack} fontSize={mainStyles.h2FontSize}>
              {car}
            </AppText>
            <View style={styles.clientAndCarDetail}>
              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h3FontSize}
              >
                Model: {model}
              </AppText>
              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h3FontSize}
              >
                Customer: {customer}
              </AppText>
            </View>
            <AppText color={colors.fontGrey} fontSize={mainStyles.h4FontSize}>
              {date}
            </AppText>
          </View>
        </View>

        <View style={styles.inspectionRating}>
          <AnimatedCircularProgress
            size={55}
            width={7}
            fill={rank * "10"}
            tintColor="#009E10"
            backgroundColor="#F4F4F4"
            duration={1000}
          >
            {() => <AppText fontSize={16}>{rank}</AppText>}
          </AnimatedCircularProgress>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InspectionCard;

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
  },
  image: {
    width: 61,
    height: 56,
    resizeMode: "cover",
    borderRadius: 4,
    overflow: "hidden",
  },
  contentContainer: {
    justifyContent: "space-between",
  },
  clientAndCarDetail: {},
});
