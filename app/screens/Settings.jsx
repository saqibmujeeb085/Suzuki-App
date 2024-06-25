import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppScreen from "../components/screen/Screen";
import AppText from "../components/text/Text";
import { mainStyles } from "../constants/style";
import { colors } from "../constants/colors";

const Settings = () => {
  return (
    <AppScreen>
      <ScrollView>
        <View style={{ gap: 20, margin: 20 }}>
          <AppText fontSize={mainStyles.h1FontSize}>h1FontSize</AppText>
          <AppText fontSize={mainStyles.h2FontSize}>h2FontSize</AppText>
          <AppText fontSize={mainStyles.h3FontSize}>h3FontSize</AppText>
          <AppText fontSize={mainStyles.h4FontSize}>h4FontSize</AppText>
          <AppText fontSize={mainStyles.RatingFont}>RatingFont</AppText>
          <AppText fontSize={mainStyles.pageHeadingFont}>
            pageHeadingFont
          </AppText>
          <AppText fontSize={mainStyles.ratingFontSize}>ratingFontSize</AppText>
          <View style={{ backgroundColor: colors.blueColor, height: 50 }}>
            <AppText>blueColor</AppText>
          </View>

          <View style={{ backgroundColor: colors.buttonGradient1, height: 50 }}>
            <AppText>buttonGradient1</AppText>
          </View>
          <View style={{ backgroundColor: colors.buttonGradient2, height: 50 }}>
            <AppText>buttonGradient2</AppText>
          </View>
          <View style={{ backgroundColor: colors.buttonGradient3, height: 50 }}>
            <AppText>buttonGradient3</AppText>
          </View>
          <View style={{ backgroundColor: colors.fontBlack, height: 50 }}>
            <AppText>fontBlack</AppText>
          </View>
          <View style={{ backgroundColor: colors.fontGrey, height: 50 }}>
            <AppText>fontGrey</AppText>
          </View>
          <View style={{ backgroundColor: colors.fontRed, height: 50 }}>
            <AppText>fontRed</AppText>
          </View>
          <View style={{ backgroundColor: colors.fontWhite, height: 50 }}>
            <AppText>fontWhite</AppText>
          </View>

          <View style={{ backgroundColor: colors.greenColor, height: 50 }}>
            <AppText>greenColor</AppText>
          </View>
          <View style={{ backgroundColor: colors.ligtGreyBg, height: 50 }}>
            <AppText>ligtGreyBg</AppText>
          </View>
          <View style={{ backgroundColor: colors.purple, height: 50 }}>
            <AppText>purple</AppText>
          </View>
          <View style={{ backgroundColor: colors.red, height: 50 }}>
            <AppText>red</AppText>
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default Settings;

const styles = StyleSheet.create({});
