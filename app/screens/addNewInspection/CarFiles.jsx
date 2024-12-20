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
import Dropdown from "../../components/formFields/Dropdown";

const CarFiles = ({ navigation }) => {
  const [carData, setCarData, resetCarData] = useContext(InspecteCarContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [cplc, setCplc] = useState("");

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

  const CplcSelected = (selected) => {
    setCplc(selected);
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

    // Validate carData before proceeding
    if (!carData || typeof carData !== "object") {
      console.error("Invalid carData object");
      setLoading(false);
      return;
    }

    const carDetails = {
      dealershipId: carData.dealershipId,
      duserId: carData.duserId,
      customerID: carData.customerID,
      registrationNo: carData.registrationNo,
      chasisNo: carData.chasisNo,
      engineNo: carData.EngineNo,
      inspectionDate: newDateTime,
      mfgId: carData.mfgId,
      carId: carData.carId,
      varientId: carData.varientId,
      engineDisplacement: carData.engineDisplacement,
      model: carData.model,
      cplc: cplc,
      province: carData.province,
      buyingCode: carData.buyingCode,
      NoOfOwners: carData.NoOfOwners,
      transmissionType: carData.transmissionType,
      mileage: carData.mileage,
      registrationCity: carData.registrationCity,
      FuelType: carData.FuelType,
      color: carData.color,
      timer: "00:00",

      // Add fallbacks for selectedImages and selectedDocuments to prevent errors
      images: (selectedImages || []).map((image, index) => ({
        uri: image.uri,
        name: image.name,
        type: image.type,
      })),
      documents: (selectedDocuments || []).map((document, index) => ({
        uri: document.uri,
        name: document.name,
        type: document.type,
      })),
      status: carData.status,
      tempID: newTempID,
      vinImage: {
        uri: carData.vinImage.uri,
        name: carData.vinImage.name,
        type: carData.vinImage.type,
      },
    };

    console.log("car Saving vinImage", carDetails);

    try {
      // Save car details with tempID to AsyncStorage
      const storedData = await AsyncStorage.getItem("@carformdata");

      let carFormDataArray = [];
      if (storedData) {
        try {
          carFormDataArray = JSON.parse(storedData);
        } catch (parseError) {
          console.error("Error parsing stored data:", parseError);
          carFormDataArray = [];
        }
      }

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
      setLoading(false);
    }
  };

  console.log(carData);

  const saveCarDetailsInDraft = async () => {
    setLoading(true);
    const newDateTime = currentDateAndTime();
    const newTempID = await incrementTempIDCounter();

    if (newTempID === null) return;

    // Validate carData before proceeding
    if (!carData || typeof carData !== "object") {
      console.error("Invalid carData object");
      setLoading(false);
      return;
    }

    const carDetails = {
      dealershipId: carData.dealershipId,
      duserId: carData.duserId,
      customerID: carData.customerID,
      registrationNo: carData.registrationNo,
      chasisNo: carData.chasisNo,
      engineNo: carData.EngineNo,
      inspectionDate: newDateTime,
      mfgId: carData.mfgId,
      carId: carData.carId,
      varientId: carData.varientId,
      engineDisplacement: carData.engineDisplacement,
      model: carData.model,
      cplc: cplc,
      province: carData.province,
      buyingCode: carData.buyingCode,
      NoOfOwners: carData.NoOfOwners,
      transmissionType: carData.transmissionType,
      mileage: carData.mileage,
      registrationCity: carData.registrationCity,
      FuelType: carData.FuelType,
      color: carData.color,
      timer: "00:00",

      // Add fallbacks for selectedImages and selectedDocuments to prevent errors
      images: (selectedImages || []).map((image, index) => ({
        uri: image.uri,
        name: image.name,
        type: image.type,
      })),
      documents: (selectedDocuments || []).map((document, index) => ({
        uri: document.uri,
        name: document.name,
        type: document.type,
      })),
      status: carData.status,
      tempID: newTempID,
      vinImage: {
        uri: carData.vinImage.uri,
        name: carData.vinImage.name,
        type: carData.vinImage.type,
      },
    };

    try {
      console.log("car Saving vinImage", carDetails.vinImage);
      // Save car details with tempID to AsyncStorage
      const storedData = await AsyncStorage.getItem("@carformdata");

      let carFormDataArray = [];
      if (storedData) {
        try {
          carFormDataArray = JSON.parse(storedData);
        } catch (parseError) {
          console.error("Error parsing stored data:", parseError);
          carFormDataArray = [];
        }
      }

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
      setLoading(false);
    }
  };

  const handleImagesSelected = (images) => {
    setSelectedImages(images);
    setIsImageUploaded(images.length === 6);
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
  const cplcOptions = [
    {
      key: "1",
      value: "Cleared",
    },
    {
      key: "2",
      value: "Non-Cleared",
    },
  ];
  return (
    <AppScreen>
      {show && (
        <ProcessModal
          show={show}
          setShow={setShow}
          icon
          pbtn={loading ? "Loading..." : "Start Inspection Now"}
          disabled={loading}
          pbtnPress={saveCarDetails}
          sbtn={"Save for later"}
          sbtnPress={saveCarDetailsInDraft}
        />
      )}
      <InspectionHeader
        // rightText={"Cancel"}
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
          <AppText
            fontSize={mainStyles.h2FontSize}
            fontFamily={mainStyles.appFontBold}
            marginTop={20}
          >
            Upload Car Documents
          </AppText>
          <AppDocumentPicker
            onDocumentsSelected={handleDocumentsSelected}
            onRemoveDoc={handleRemoveDocument}
          />
          <Dropdown
            DropItems="CPLC"
            Data={cplcOptions}
            save={"value"}
            selectedItem={CplcSelected}
          />
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton
          onPress={ShowModal}
          disabled={selectedImages.length !== 6 || !cplc || loading}
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
