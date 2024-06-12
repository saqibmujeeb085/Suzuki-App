import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const SingleInspectionSkeletonPreloader = () => {
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
    <View style={styles.inspectionBox}>
      <View style={styles.textSkeleton}>
        <GradientOverlay />
      </View>
      <View style={styles.sliderContainer}>
        <View style={styles.valueSkeleton}>
          <GradientOverlay />
        </View>
        <View style={styles.range}>
          {[...Array(9)].map((_, index) => (
            <View
              key={index}
              style={{
                ...styles.line,
                left: `${(index + 1) * 10}%`,
              }}
            ></View>
          ))}
          <View style={styles.sliderSkeleton}>
            <GradientOverlay />
          </View>
        </View>
      </View>
      <View style={styles.imagePickerSkeleton}>
        <GradientOverlay />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inspectionBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    gap: 20,
  },
  textSkeleton: {
    height: 18,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: 'hidden',
    width: '80%',
  },
  sliderContainer: {
    marginTop: 10,
  },
  valueSkeleton: {
    height: 20,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: 'hidden',
    width: '30%',
    alignSelf: 'flex-end',
  },
  range: {
    width: '100%',
    backgroundColor: '#E1E1E1',
    marginTop: 20,
    overflow: 'visible',
    borderRadius: 20,
    maxHeight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    top: 5,
    height: 6,
    width: 1,
    backgroundColor: '#000000',
  },
  sliderSkeleton: {
    width: '100%',
    height: 20,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  imagePickerSkeleton: {
    height: 100,
    backgroundColor: colors.fontGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
});

export default SingleInspectionSkeletonPreloader;
