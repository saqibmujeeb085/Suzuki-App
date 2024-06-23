import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

const imageWidth = width - 20;

const AppImagePicker = ({ onImagesSelected, onRemoveImage }) => {
  const [images, setImages] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.5,
    });
    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.uri.split("/").pop(),
        type: asset.mimeType,
      }));
      addImages(selectedImages);
    }
    setModalVisible(false);
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();

      addImages([{ uri: localUri, name: filename, type: "image/jpeg" }]);
    }
    setModalVisible(false);
  };

  const addImages = (newImages) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
    onImagesSelected((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    const removedImage = images[index];
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onRemoveImage(removedImage);

    // Adjust the current index and scroll if needed
    if (currentIndex >= newImages.length) {
      setCurrentIndex(newImages.length - 1);
      if (newImages.length > 0) {
        flatListRef.current.scrollToIndex({
          index: newImages.length - 1,
          animated: true,
        });
      }
    }
  };

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
    <ScrollView>
      <View style={styles.pickerContainer}>
        {images.length === 0 ? (
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View style={styles.pickerImageContainer}>
            <View style={styles.pickerIconContainer}>
              <Ionicons name="image-outline" size={50} color={"#C9C9C9"} />
              <AppText fontSize={12} color={"#525252"}>
                Add Photos
              </AppText>
            </View>
          </View>
        </TouchableWithoutFeedback>
        ) : (
          <View style={styles.CarouselImages}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.carouselImage}
                  />
                  <TouchableOpacity
                    style={styles.removeIconContainer}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
            />
          </View>
        )}

        <ScrollView horizontal contentContainerStyle={styles.thumbnailContainer}>
          {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => onThumbnailPress(index)}>
              <Image
                source={{ uri: image.uri }}
                style={[
                  styles.thumbnail,
                  index === currentIndex && styles.activeThumbnail,
                ]}
              />
            </TouchableOpacity>
          ))}
          {images.length >= 1 && images.length < 5 && (
  <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
    <View style={styles.AddButton}>
      <MaterialCommunityIcons name="plus" size={20} color={colors.fontBlack} />
    </View>
  </TouchableWithoutFeedback>
)}

        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons
                name="close"
                size={14}
                color={"#1D1D1D"}
              />
            </TouchableOpacity>
            <View style={styles.chooseBox}>
              <TouchableOpacity onPress={pickImage}>
                <View style={styles.modalButton}>
                  <Ionicons name="image-outline" size={25} color={"#000"} />
                  <AppText fontSize={mainStyles.h2FontSize}>Gallery</AppText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={captureImage}>
                <View style={styles.modalButton}>
                  <Ionicons name="camera-outline" size={25} color={"#000"} />
                  <AppText fontSize={mainStyles.h2FontSize}>Camera</AppText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AppImagePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    gap: 10,
  },
  imageContainer: {
    width: imageWidth,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  carouselImage: {
    width: imageWidth - 20,
    height: 300,
    resizeMode: "cover",
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
  AddButton: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  activeThumbnail: {
    borderColor: colors.purple,
  },
  pickerImageContainer: {
    backgroundColor: "white",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 2,
  },
  pickerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  imageContainer: {
    marginRight: 10,
    position: "relative",
  },
  removeIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    width: 300,
  },
  chooseBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 40,
    height: 25,
    width: 25,
    backgroundColor: "#BBBBBB",
    justifyContent: "center",
    alignItems: "center",
  },
});
