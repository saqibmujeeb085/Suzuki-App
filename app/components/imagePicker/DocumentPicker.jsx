import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../text/Text";
import { colors } from "../../constants/colors";
import { mainStyles } from "../../constants/style";

const AppDocumentPicker = ({ onDocumentsSelected, onRemoveDoc }) => {
  const [documents, setDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    console.log("Document Picker result:", result); // Log the entire result

    if (result.type !== "cancel") {
      const newDocument = {
        uri: result.uri,
        name: result.name,
        type: result.mimeType || "application/pdf",
      };

      console.log("Picked document:", newDocument); // Debug log
      addDocument(newDocument);
    }
    setModalVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.uri.split("/").pop(),
        type: asset.type || "image/jpeg",
      }));
      console.log("Picked image:", selectedImages[0]); // Debug log
      addDocument(selectedImages[0]);
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

      const newImage = { uri: localUri, name: filename, type: "image/jpeg" };
      console.log("Captured image:", newImage); // Debug log
      addDocument(newImage);
    }
    setModalVisible(false);
  };

  const addDocument = (newDoc) => {
    setDocuments((prevDocs) => {
      const updatedDocs = [...prevDocs, newDoc];
      console.log("Documents after adding:", updatedDocs); // Debug log
      onDocumentsSelected(updatedDocs);
      return updatedDocs;
    });
  };

  const removeDocument = (index) => {
    setDocuments((prevDocs) => {
      const updatedDocs = prevDocs.filter((_, i) => i !== index);
      console.log("Documents after removing:", updatedDocs); // Debug log
      onDocumentsSelected(updatedDocs);
      return updatedDocs;
    });
  };

  console.log("Documents to render:", documents); // Log documents before rendering

  return (
    <ScrollView>
      <View style={styles.pickerContainer}>
        {documents.map((document, index) => (
          <View key={index} style={styles.documentContainer}>
            <AppText
              fontSize={mainStyles.h2FontSize}
              width={200}
              color={colors.fontBlack}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {document.name}
            </AppText>
            <TouchableOpacity
              style={styles.removeIconContainer}
              onPress={() => removeDocument(index)}
            >
              <Feather name="x-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View style={styles.uploadButton}>
            <AppText color={colors.fontGrey} fontSize={mainStyles.h3FontSize}>
              Upload Document only in pdf or word file
            </AppText>
            <Feather name="upload" size={12} color={colors.fontGrey} />
          </View>
        </TouchableWithoutFeedback>
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
              <TouchableOpacity onPress={pickDocument}>
                <View style={styles.modalButton}>
                  <Ionicons name="document-outline" size={25} color={colors.fontBlack} />
                  <AppText fontSize={16}>Document</AppText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage}>
                <View style={styles.modalButton}>
                  <Ionicons name="image-outline" size={25} color={colors.fontBlack} />
                  <AppText fontSize={16}>Gallery</AppText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={captureImage}>
                <View style={styles.modalButton}>
                  <Ionicons name="camera-outline" size={25} color={colors.fontBlack} />
                  <AppText fontSize={16}>Camera</AppText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AppDocumentPicker;

const styles = StyleSheet.create({
  pickerContainer: {
    gap: 10,
  },
  documentContainer: {
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
    gap: 5,
    padding: 10,
  },
  removeIconContainer: {
    marginLeft: 10,
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
    width: 320,
  },
  chooseBox: {
    flexDirection: "row",
    justifyContent: "space-between",
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
