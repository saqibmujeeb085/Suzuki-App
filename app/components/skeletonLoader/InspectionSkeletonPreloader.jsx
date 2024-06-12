import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const InspectionSkeletonPreloader = () => {
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
        colors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      />
    </Animated.View>
  );

  return (
    <View style={styles.skeletonCard}>
      <View style={styles.inpsectionContent}>
        <View style={styles.iconSkeleton}>
          <GradientOverlay />
        </View>
        <View style={styles.inpectionContentText}>
          <View style={styles.lineSkeleton}>
            <GradientOverlay />
          </View>
          <View style={[styles.lineSkeleton, styles.shortLineSkeleton]}>
            <GradientOverlay />
          </View>
        </View>
      </View>
      <View style={styles.inpsectionRating}>
        <View style={[styles.lineSkeleton, styles.shortLineSkeleton]}>
          <GradientOverlay />
        </View>
        <View style={styles.lineSkeleton}>
          <GradientOverlay />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    padding: 20,
    elevation: 2,
    marginBottom: 10,
  },
  inpsectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSkeleton: {
    width: 20,
    height: 20,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  inpectionContentText: {
    marginLeft: 10,
    flex: 1,
  },
  inpsectionRating: {
    alignItems: 'flex-end',
  },
  lineSkeleton: {
    height: 7,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  shortLineSkeleton: {
    width: '60%',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
});

export default InspectionSkeletonPreloader;
