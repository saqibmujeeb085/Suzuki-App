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

const DraftCarImagesCarousel = ({ images }) => {
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

  return (
    <View style={styles.container}>
      {images && images.length > 0 && (
        <>
          <View style={styles.CarouselImages}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.carouselImage}
                  />
                </View>
              )}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
            />
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={styles.thumbnailContainer}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onThumbnailPress(index)}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={[
                    styles.thumbnail,
                    index === currentIndex && styles.activeThumbnail,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
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

export default DraftCarImagesCarousel;
