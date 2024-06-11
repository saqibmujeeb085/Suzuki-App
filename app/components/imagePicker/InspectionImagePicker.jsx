import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";

const InspectionImagePicker = ({
  onImageSelected,
  onSelectedImageName,
  onRemoveImage,
}) => {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();

      addImage(localUri, filename);
    }
    setModalVisible(false);
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();

      addImage(localUri, filename);
    }
    setModalVisible(false);
  };

  const addImage = (uri, name) => {
    setImages((prevImages) => [...prevImages, { uri, name }]);
    onImageSelected(uri);
    onSelectedImageName(name);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Notify parent component that an image has been removed
  };

  return (
    <ScrollView>
      <View style={styles.pickerContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <AppText
              fontSize={12}
              width={200}
              color={"#000"}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {image.name}
            </AppText>
            <TouchableOpacity
              style={styles.removeIconContainer}
              onPress={() => removeImage(index)}
            >
              <Feather name="x-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 1 && (
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <View style={styles.uploadButton}>
              <AppText color={"#BBBBBB"} fontSize={10}>
                Upload Image (jpeg, png, jpg)
              </AppText>
              <Feather name="upload" size={12} color={"#BBBBBB"} />
            </View>
          </TouchableWithoutFeedback>
        )}
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

export default InspectionImagePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    gap: 10,
    padding: 10,
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  uploadButton: {
    backgroundColor: "white",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    elevation: 2,
    flexDirection: "row",
    padding: 10,
  },
  removeIconContainer: {
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
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
