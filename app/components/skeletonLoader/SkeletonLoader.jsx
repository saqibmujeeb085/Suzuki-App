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

const SkeletonLoader = () => {
  const translateX = useSharedValue(-width);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // useEffect(() => {
  //   translateX.value = withRepeat(
  //     withTiming(width, {
  //       duration: 1000,
  //       easing: Easing.linear,
  //     }),
  //     -1,
  //     true
  //   );
  // }, []);
  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [translateX]);
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

  return (
    <View style={styles.container}>
      <View style={styles.skeletonCard}>
        <View style={styles.imageSkeleton}>
          <GradientOverlay />
        </View>
        <View style={styles.contentSkeleton}>
          <View style={styles.lineSkeleton}>
            <GradientOverlay />
          </View>
          <View style={[styles.lineSkeleton, styles.shortLineSkeleton]}>
            <GradientOverlay />
          </View>
          <View style={styles.lineSkeleton}>
            <GradientOverlay />
          </View>
        </View>
        <View style={styles.circularSkeleton}>
          <GradientOverlay />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    elevation: 2,
  },
  skeletonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    marginVertical: 5,
    marginHorizontal: 20,
    overflow: "hidden",
    width: width - 40,
    height: 100,
  },
  imageSkeleton: {
    width: 61,
    height: 56,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: "hidden",
  },
  contentSkeleton: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 14,
  },
  lineSkeleton: {
    height: 7,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    marginVertical: 2,
    overflow: "hidden",
  },
  shortLineSkeleton: {
    width: "60%",
  },
  circularSkeleton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: colors.fontGrey,
    overflow: "hidden",
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
});

export default SkeletonLoader;
