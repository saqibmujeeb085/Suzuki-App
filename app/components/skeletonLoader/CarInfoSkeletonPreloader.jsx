import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

const CarInfoSkeletonPreloader = () => {
  const translateX = useSharedValue(-width);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  const GradientOverlay = () => (
    <Animated.View style={[styles.gradientContainer, animatedStyle]}>
      <LinearGradient
        colors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      />
    </Animated.View>
  );

  const renderSkeletonLine = (width) => (
    <View style={[styles.lineSkeleton, { width }]}>
      <GradientOverlay />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <View style={styles.imageSkeleton}>
          <GradientOverlay />
        </View>
      </View>
      <View style={styles.contentContainer}>
        {[...Array(15)].map((_, index) => (
          <View key={index} style={styles.infoContainer}>
            {renderSkeletonLine("40%")}
            {renderSkeletonLine("50%")}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 60,
  },
  imageSkeleton: {
    width: "100%",
    height: 300,
    backgroundColor: colors.fontGrey,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
  },
  infoContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  lineSkeleton: {
    height: 18,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: "hidden",
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
});

export default CarInfoSkeletonPreloader;
