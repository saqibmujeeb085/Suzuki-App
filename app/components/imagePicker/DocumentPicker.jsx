import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import * as DocumentPicker from "expo-document-picker";
  import { Feather } from "@expo/vector-icons";
  import AppText from "../text/Text";
  
  const AppDocumentPicker = ({ onDocumentsSelected }) => {
    const [documents, setDocuments] = useState([]);
  
    const pickDocument = async () => {
      let result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
        multiple: false,
      });
  
      if (result.type !== "cancel" && result.uri) {
        const newDocument = {
          uri: result.uri,
          name: result.name,
        };
        addDocument(newDocument);
      }
    };
  
    const addDocument = (newDoc) => {
      setDocuments((prevDocs) => [...prevDocs, newDoc]);
      onDocumentsSelected([...documents, newDoc]);
    };
  
    const removeDocument = (index) => {
      const updatedDocuments = documents.filter((_, i) => i !== index);
      setDocuments(updatedDocuments);
      onDocumentsSelected(updatedDocuments);
    };
  
    return (
      <ScrollView>
        <View style={styles.pickerContainer}>
          {documents.map((document, index) => (
            <View key={index} style={styles.documentContainer}>
              <AppText
                fontSize={12}
                width={200}
                color={"#000"}
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
          <TouchableWithoutFeedback onPress={pickDocument}>
            <View style={styles.uploadButton}>
              <AppText color={"#BBBBBB"} fontSize={10}>
                Upload Document only in pdf or word file
              </AppText>
              <Feather name="upload" size={12} color={"#BBBBBB"} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    );
  };
  
  export default AppDocumentPicker;
  
  const styles = StyleSheet.create({
    pickerContainer: {
      gap: 10,
    },
    documentContainer: {
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
      gap: 5,
      padding: 10,
    },
    removeIconContainer: {
      marginLeft: 10,
    },
  });
  