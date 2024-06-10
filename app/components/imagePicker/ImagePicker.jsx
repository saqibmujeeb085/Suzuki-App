import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Text,
  AppRegistry,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { mainStyles } from "../../constants/style";

const AppImagePicker = ({ onImageSelected, onSelectedImageName }) => {
  const [images, setImages] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
    onImageSelected(null);
    onSelectedImageName("");
  };

  const toggleExpanded = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <ScrollView>
      <View style={styles.pickerContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.accordionContainer}>
            <TouchableOpacity onPress={() => toggleExpanded(index)}>
              <View style={styles.accordionHeader}>
                <AppText fontSize={16} color={"#000"}>
                  {image.name}
                </AppText>
                <Feather
                  name={expanded === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            {expanded === index && (
              <View style={styles.accordionContent}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeIconContainer}
                  onPress={() => removeImage(index)}
                >
                  <Feather name="x-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {images.length < 5 && (
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
                onPress={() => setShow(!show)}
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
  accordionContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
    marginVertical: 5,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  accordionContent: {
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  removeIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
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

  cancel: {
    position: "absolute",
    top: 0,
    right: 0,
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
