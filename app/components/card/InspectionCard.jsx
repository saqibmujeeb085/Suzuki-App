import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { mainStyles } from "../../constants/style";

const InspectionCard = ({
  car,
  mileage,
  date,
  varient,
  carImage,
  rank,
  onPress,
}) => {
  const getColorByRank = (rank) => {
    if (rank <= 5.9) return colors.red;
    if (rank <= 7.9) return colors.yellow;
    if (rank <= 8.9) return colors.blue;
    return colors.green;
  };

  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.Container}>
        <View style={styles.inspectionDestailsContainer}>
          <Image
            source={{ uri: `${process.env.IMAGE_URL}/${carImage}` }}
            style={styles.image}
          />
          <View style={styles.contentContainer}>
            <AppText
              color={colors.fontBlack}
              fontSize={mainStyles.h2FontSize}
              textTransform={"capitalize"}
            >
              {car}
            </AppText>
            <View style={styles.clientAndCarDetail}>
              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h4FontSize}
              >
                Varient: {varient}
              </AppText>

              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h4FontSize}
              >
                mileage: {mileage}
              </AppText>
            </View>
            <AppText color={colors.fontGrey} fontSize={mainStyles.h4FontSize}>
              {date}
            </AppText>
          </View>
        </View>

        <View style={styles.inspectionRating}>
          <AnimatedCircularProgress
            size={65}
            width={9}
            fill={rank * 10} // This should be a number
            tintColor={getColorByRank(rank)}
            backgroundColor={colors.ligtGreyBg} // Call the function with rank
            duration={1000}
          >
            {() => <AppText fontSize={mainStyles.RatingFont}>{rank}</AppText>}
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
});
