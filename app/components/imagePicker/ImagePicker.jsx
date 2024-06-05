import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons } from "@expo/vector-icons";
import AppText from "../text/Text";

const AppImagePicker = ({
  onImageSelected,
  onSelectedImageName,
}) => {
  
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split('/').pop();

      setImage(localUri);
      setImageName(filename);

      onImageSelected(localUri); // Pass the selected image URI to the callback function
      onSelectedImageName(filename);
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerImageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : (
          <View style={styles.pickerIconContainer}>
            <Ionicons name="image-outline" size={50} color={"#C9C9C9"} />
            <AppText fontSize={12} color={"#525252"}>
              Add Photos and Videos
            </AppText>
          </View>
        )}
      </View>
      <View>
        <TouchableWithoutFeedback onPress={pickImage}>
          <View style={styles.UploadButton}>
            {image ? (
              <AppText
                color={"#BBBBBB"}
                fontSize={10}
                numberOfLines={1}
                ellipsizeMode="tail"
                width={"80%"}
              >
                {imageName}
              </AppText>
            ) : (
              <AppText color={"#BBBBBB"} fontSize={10}>
                Upload Document
              </AppText>
            )}
            <Feather name="upload" size={12} color={"#BBBBBB"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default AppImagePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    gap: 10,
  },
  pickerImageContainer: {
    backgroundColor: "white",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  pickerIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  UploadButton: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
  },
});
