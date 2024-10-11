import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

const imageWidth = width - 20;

const CarImagesCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onThumbnailPress = (index) => {
    setCurrentIndex(index);
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  const onViewRef = useRef((viewableItems) => {
    if (viewableItems.viewableItems.length > 0) {
      setCurrentIndex(viewableItems.viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // console.log(images);
  console.log(process.env.IMAGE_URL);
  return (
    <View style={styles.container}>
      <View style={styles.CarouselImages}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `${process.env.IMAGE_URL}${item.image_uri}` }}
                style={styles.carouselImage}
              />
            </View>
          )}
          keyExtractor={(item, index) => index}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      </View>
      {/* {images.length > 1 && ( */}
      <ScrollView horizontal contentContainerStyle={styles.thumbnailContainer}>
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => onThumbnailPress(index)}>
            <Image
              source={{ uri: `${process.env.IMAGE_URL}${image.image_uri}` }}
              style={[
                styles.thumbnail,
                index === currentIndex && styles.activeThumbnail,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000000",
  },
  imageContainer: {
    width: imageWidth,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 5,
  },
  thumbnailContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  CarouselImages: {
    borderRadius: 5,
    overflow: "hidden",
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.fontGrey,
  },
  activeThumbnail: {
    borderColor: colors.purple,
  },
});

export default CarImagesCarousel;
