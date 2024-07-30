import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import AppImagePicker from "../../components/imagePicker/ImagePicker";
import GradientButton from "../../components/buttons/GradientButton";
import ProcessModal from "../../components/modals/ProcessModal";
import { InspecteCarContext } from "../../context/newInspectionContext";
import axios from "axios";
import AppText from "../../components/text/Text";
import AppDocumentPicker from "../../components/imagePicker/DocumentPicker";
import { mainStyles } from "../../constants/style";
import { colors } from "../../constants/colors";

const CarFiles = ({ navigation }) => {
  const [carData, setCarData, resetCarData] = useContext(InspecteCarContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // State to track if an image is uploaded

  const [currentDateTime, setCurrentDateTime] = useState("");

  // console.log("hello", selectedImages);

  const [show, setShow] = useState(false);
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

  const postCarDetails = async () => {
    const newDateTime = currentDateAndTime();

    setCarData((prevData) => ({
      ...prevData,
      inspectionDate: newDateTime,
    }));

    if (selectedImages.length > 0 || selectedDocuments.length > 0) {
      let data = new FormData();
      data.append("dealershipId", carData.dealershipId);
      data.append("duserId", carData.duserId);
      data.append("customerID", carData.customerID);
      data.append("registrationNo", carData.registrationNo);
      data.append("chasisNo", carData.chasisNo);
      data.append("EngineNo", carData.EngineNo);
      data.append("inspectionDate", newDateTime);
      data.append("mfgId", carData.mfgId);
      data.append("carId", carData.carId);
      data.append("varientId", carData.varientId);
      data.append("engineDisplacement", carData.engineDisplacement);
      data.append("model", carData.model);
      data.append("cplc", carData.cplc);
      data.append("buyingCode", carData.buyingCode);
      data.append("NoOfOwners", carData.NoOfOwners);
      data.append("transmissionType", carData.transmissionType);
      data.append("mileage", carData.mileage);
      data.append("registrationCity", carData.registrationCity);
      data.append("engineCapacity", carData.engineCapacity);
      data.append("FuelType", carData.FuelType);
      data.append("color", carData.color);
      selectedImages.forEach((image, index) => {
        data.append(`images[${index}]`, {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      });
      selectedDocuments.forEach((document, index) => {
        data.append(`documents[${index}]`, {
          uri: document.uri,
          name: document.name,
          type: document.type,
        });
      });
      data.append("status", carData.status);

      try {
        setLoading(true);
        const headers = {
          "Content-Type": "multipart/form-data",
        };
        const response = await axios.post("/auth/addcarInfo.php", data, {
          headers: headers,
        });

        console.log("Response:", response.data);

        setLoading(false);
        resetCarData(); // Reset the data here
        navigation.navigate("InspectionBoard", {
          id: response.data.last_id,
        });
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    } else {
      alert("Please Select Image or Document First");
    }
  };

  const postCarDetailsAsDraft = async () => {
    const newDateTime = currentDateAndTime();

    if (selectedImages.length > 0 || selectedDocuments.length > 0) {
      let data = new FormData();
      data.append("dealershipId", carData.dealershipId);
      data.append("duserId", carData.duserId);
      data.append("customerID", carData.customerID);
      data.append("registrationNo", carData.registrationNo);
      data.append("chasisNo", carData.chasisNo);
      data.append("EngineNo", carData.EngineNo);
      data.append("inspectionDate", newDateTime);
      data.append("mfgId", carData.mfgId);
      data.append("carId", carData.carId);
      data.append("varientId", carData.varientId);
      data.append("engineDisplacement", carData.engineDisplacement);
      data.append("model", carData.model);
      data.append("cplc", carData.cplc);
      data.append("buyingCode", carData.buyingCode);
      data.append("NoOfOwners", carData.NoOfOwners);
      data.append("transmissionType", carData.transmissionType);
      data.append("mileage", carData.mileage);
      data.append("registrationCity", carData.registrationCity);
      data.append("engineCapacity", carData.engineCapacity);
      data.append("FuelType", carData.FuelType);
      data.append("color", carData.color);
      selectedImages.forEach((image, index) => {
        data.append(`images[${index}]`, {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      });
      selectedDocuments.forEach((document, index) => {
        data.append(`documents[${index}]`, {
          uri: document.uri,
          name: document.name,
          type: document.type,
        });
      });
      data.append("status", carData.status);

      try {
        setLoading(true);
        const headers = {
          "Content-Type": "multipart/form-data",
        };
        const response = await axios.post("/auth/addcarInfo.php", data, {
          headers: headers,
        });

        console.log("Response:", response.data);
        setLoading(false);
        resetCarData(); // Reset the data here
        navigation.navigate("Draft");
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    } else {
      alert("Please Select Image or Document First");
    }
  };

  const handleImagesSelected = (images) => {
    setSelectedImages(images);
    setIsImageUploaded(true); // Set the image uploaded state to true
  };

  const handleDocumentsSelected = (documents) => {
    setSelectedDocuments(documents);
  };

  const handleRemoveImage = (removedImage) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image.uri !== removedImage.uri)
    );
    if (selectedImages.length === 1) {
      setIsImageUploaded(false); // Set the image uploaded state to false if no images left
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
          pbtnPress={postCarDetails}
          sbtn={"Save for later"}
          sbtnPress={postCarDetailsAsDraft}
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
          {/* <AppText fontSize={mainStyles.h3FontSize} textAlign={"center"}>
            Upload Car Images
          </AppText> */}
          <AppImagePicker
            onImagesSelected={handleImagesSelected}
            onRemoveImage={handleRemoveImage} // Pass the remove image handler
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
  addMoreButton: {
    alignItems: "flex-end",
  },
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
