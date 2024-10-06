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
import { colors } from "../../constants/colors";

const InspectionImagePicker = ({
  onImageSelected = () => {}, // Default prop to an empty function
  onSelectedImageName = () => {},
  onRemoveImage = () => {},
}) => {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
    });
    setModalVisible(false);

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();

      addImage(localUri, filename);
    }
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
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    onRemoveImage(index); // Notify parent component that an image has been removed
  };

  return (
    <ScrollView>
      <View style={styles.pickerContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <AppText
              fontSize={mainStyles.h3FontSize}
              width={100}
              color={colors.fontBlack}
              numberOfLines={1}
              ellipsizeMode="tail"
              maxWidth={"45%"}
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
              <AppText color={colors.fontGrey} fontSize={mainStyles.h3FontSize}>
                Upload Image (jpeg, png)
              </AppText>
              <Feather name="upload" size={20} color={colors.fontGrey} />
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
                  <Ionicons
                    name="image-outline"
                    size={25}
                    color={colors.fontBlack}
                  />
                  <AppText fontSize={mainStyles.h2FontSize}>Gallery</AppText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={captureImage}>
                <View style={styles.modalButton}>
                  <Ionicons
                    name="camera-outline"
                    size={25}
                    color={colors.fontBlack}
                  />
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
    flex: 1,
  },
  imageContainer: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    elevation: 2,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  uploadButton: {
    backgroundColor: colors.whiteBg,
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
    backgroundColor: colors.whiteBg,
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
