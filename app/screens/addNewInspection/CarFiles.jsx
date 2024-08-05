import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import AppImagePicker from "../../components/imagePicker/ImagePicker";
import GradientButton from "../../components/buttons/GradientButton";
import ProcessModal from "../../components/modals/ProcessModal";
import { InspecteCarContext } from "../../context/newInspectionContext";
import AppText from "../../components/text/Text";
import AppDocumentPicker from "../../components/imagePicker/DocumentPicker";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CarFiles = ({ navigation }) => {
  const [carData, setCarData, resetCarData] = useContext(InspecteCarContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const [show, setShow] = useState(false);
  const [tempIDCounter, setTempIDCounter] = useState(0);

  useEffect(() => {
    // Load tempIDCounter from AsyncStorage on component mount
    const loadTempIDCounter = async () => {
      try {
        const counter = await AsyncStorage.getItem("@tempIDCounter");
        if (counter !== null) {
          setTempIDCounter(parseInt(counter, 10));
        }
      } catch (error) {
        console.error("Failed to load tempIDCounter:", error);
      }
    };
    loadTempIDCounter();
  }, []);

  const incrementTempIDCounter = async () => {
    try {
      const newCounter = tempIDCounter + 1;
      await AsyncStorage.setItem("@tempIDCounter", newCounter.toString());
      setTempIDCounter(newCounter);
      return newCounter;
    } catch (error) {
      console.error("Failed to increment tempIDCounter:", error);
      return null;
    }
  };

  const ShowModal = () => {
    setShow(!show);
  };

  const currentDateAndTime = () => {
    const padZero = (number) => (number < 10 ? `0${number}` : number);

    const date = new Date();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month}/${day}/${year} - ${hours}:${minutes}${ampm}`;
  };

  const saveCarDetails = async () => {
    setLoading(true);
    const newDateTime = currentDateAndTime();
    const newTempID = await incrementTempIDCounter();

    if (newTempID === null) return;

    const carDetails = {
      dealershipId: carData.dealershipId,
      duserId: carData.duserId,
      customerID: carData.customerID,
      registrationNo: carData.registrationNo,
      chasisNo: carData.chasisNo,
      EngineNo: carData.EngineNo,
      inspectionDate: newDateTime,
      mfgId: carData.mfgId,
      carId: carData.carId,
      varientId: carData.varientId,
      engineDisplacement: carData.engineDisplacement,
      model: carData.model,
      cplc: carData.cplc,
      buyingCode: carData.buyingCode,
      NoOfOwners: carData.NoOfOwners,
      transmissionType: carData.transmissionType,
      mileage: carData.mileage,
      registrationCity: carData.registrationCity,
      engineCapacity: carData.engineCapacity,
      FuelType: carData.FuelType,
      color: carData.color,
      images: selectedImages.map((image, index) => ({
        uri: image.uri,
        name: image.name,
        type: image.type,
      })),
      documents: selectedDocuments.map((document, index) => ({
        uri: document.uri,
        name: document.name,
        type: document.type,
      })),
      status: carData.status,
      tempID: newTempID,
    };

    try {
      // Save car details with tempID to AsyncStorage
      const storedData = await AsyncStorage.getItem("@carformdata");
      const carFormDataArray = storedData ? JSON.parse(storedData) : [];
      carFormDataArray.push(carDetails);
      await AsyncStorage.setItem(
        "@carformdata",
        JSON.stringify(carFormDataArray)
      );

      setLoading(false);
      setShow(false);
      navigation.navigate("InspectionBoard", {
        id: newTempID,
      });

      console.log("Car details saved with tempID:", newTempID);
      resetCarData(); // Reset the data here
    } catch (error) {
      console.error("Error saving car details:", error);
    }
  };

  const saveCarDetailsInDraft = async () => {
    setLoading(true);
    const newDateTime = currentDateAndTime();
    const newTempID = await incrementTempIDCounter();

    if (newTempID === null) return;

    const carDetails = {
      dealershipId: carData.dealershipId,
      duserId: carData.duserId,
      customerID: carData.customerID,
      registrationNo: carData.registrationNo,
      chasisNo: carData.chasisNo,
      EngineNo: carData.EngineNo,
      inspectionDate: newDateTime,
      mfgId: carData.mfgId,
      carId: carData.carId,
      varientId: carData.varientId,
      engineDisplacement: carData.engineDisplacement,
      model: carData.model,
      cplc: carData.cplc,
      buyingCode: carData.buyingCode,
      NoOfOwners: carData.NoOfOwners,
      transmissionType: carData.transmissionType,
      mileage: carData.mileage,
      registrationCity: carData.registrationCity,
      engineCapacity: carData.engineCapacity,
      FuelType: carData.FuelType,
      color: carData.color,
      images: selectedImages.map((image, index) => ({
        uri: image.uri,
        name: image.name,
        type: image.type,
      })),
      documents: selectedDocuments.map((document, index) => ({
        uri: document.uri,
        name: document.name,
        type: document.type,
      })),
      status: carData.status,
      tempID: newTempID,
    };

    try {
      // Save car details with tempID to AsyncStorage
      const storedData = await AsyncStorage.getItem("@carformdata");
      const carFormDataArray = storedData ? JSON.parse(storedData) : [];
      carFormDataArray.push(carDetails);
      await AsyncStorage.setItem(
        "@carformdata",
        JSON.stringify(carFormDataArray)
      );

      setLoading(false);
      setShow(false);
      navigation.navigate("Draft");

      console.log("Car details saved with tempID:", newTempID);
      resetCarData(); // Reset the data here
    } catch (error) {
      console.error("Error saving car details:", error);
    }
  };

  const handleImagesSelected = (images) => {
    setSelectedImages(images);
    setIsImageUploaded(true);
  };

  const handleDocumentsSelected = (documents) => {
    setSelectedDocuments(documents);
  };

  const handleRemoveImage = (removedImage) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image.uri !== removedImage.uri)
    );
    if (selectedImages.length === 1) {
      setIsImageUploaded(false);
    }
  };

  const handleRemoveDocument = (removedDocument) => {
    setSelectedDocuments((prevDocuments) =>
      prevDocuments.filter((document) => document.uri !== removedDocument.uri)
    );
  };

  return (
    <AppScreen>
      {show && (
        <ProcessModal
          show={show}
          setShow={setShow}
          icon
          heading={"Customer ID: 0KD560PLF"}
          text={"You have to complete the inspection in 20 minutes."}
          pbtn={loading ? "Loading..." : "Start Inspection Now"}
          disabled={loading}
          pbtnPress={saveCarDetails}
          sbtn={"Save for later"}
          sbtnPress={saveCarDetailsInDraft}
        />
      )}
      <InspectionHeader
        rightText={"Cancel"}
        onPress={() => navigation.goBack()}
      >
        Uploads
      </InspectionHeader>
      <ScrollView>
        <View style={styles.UploadScreenContainer}>
          <AppImagePicker
            onImagesSelected={handleImagesSelected}
            onRemoveImage={handleRemoveImage}
          />
          <AppText fontSize={mainStyles.h3FontSize} marginTop={20}>
            Upload Car Documents
          </AppText>
          <AppDocumentPicker
            onDocumentsSelected={handleDocumentsSelected}
            onRemoveDoc={handleRemoveDocument}
          />
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton
          onPress={ShowModal}
          disabled={!isImageUploaded || loading}
        >
          Start Inspection
        </GradientButton>
      </View>
    </AppScreen>
  );
};

export default CarFiles;

const styles = StyleSheet.create({
  UploadScreenContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 120,
  },
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
