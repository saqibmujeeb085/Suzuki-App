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

const CarFiles = ({ navigation }) => {
  const [carData, setCarData, resetCarData] = useContext(InspecteCarContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [documentSelected, setDocumentSelected] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // State to track if an image is uploaded

  const [currentDateTime, setCurrentDateTime] = useState("");

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

    setCurrentDateTime(`${month}/${day}/${year} - ${hours}:${minutes}${ampm}`);
  };
  
  const postCarDetails = async (selectedImage, selectedImageName) => {
    currentDateAndTime();

    setCarData((prevData) => ({
      ...prevData,
      inspectionDate: currentDateTime,
    }));

    console.log(carData.inspectionDate);

    if (selectedImageName !== "") {
      let data = new FormData();
      data.append("dealershipId", carData.dealershipId);
      data.append("duserId", carData.duserId);
      data.append("customerID", carData.customerID);
      data.append("registrationNo", carData.registrationNo);
      data.append("chasisNo", carData.chasisNo);
      data.append("EngineNo", carData.EngineNo);
      data.append("inspectionDate", carData.inspectionDate);
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
      data.append("FuelType", carData.FuelType);
      data.append("color", carData.color);
      data.append("carPic", {
        uri: selectedImage,
        name: selectedImageName,
        type: "image/jpeg",
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
      alert("Please Select Image First");
    }
  };

  const postCarDetailsAsDraft = async (selectedImage, selectedImageName) => {
    currentDateAndTime();
    if (selectedImage !== "") {
      let data = new FormData();
      data.append("dealershipId", carData.dealershipId);
      data.append("duserId", carData.duserId);
      data.append("customerID", carData.customerID);
      data.append("registrationNo", carData.registrationNo);
      data.append("chasisNo", carData.chasisNo);
      data.append("EngineNo", carData.EngineNo);
      data.append("inspectionDate", currentDateTime);
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
      data.append("FuelType", carData.FuelType);
      data.append("color", carData.color);
      data.append("carPic", {
        uri: selectedImage,
        name: selectedImageName,
        type: "image/jpeg",
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
      alert("Please Select Image First");
    }
  };

  const handleImageSelected = (imageUri) => {
    setSelectedImage(imageUri);
    setIsImageUploaded(true); // Set the image uploaded state to true
  };

  const handleImageNameSelected = (imageName) => {
    setSelectedImageName(imageName);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageName(null);
    setIsImageUploaded(false); // Set the image uploaded state to false
  };

  return (
    <AppScreen>
      <ScrollView>
      {show && (
        <ProcessModal
          show={show}
          setShow={setShow}
          icon
          heading={"Customer ID: 0KD560PLF"}
          text={"You have to complete the inspection in 20 minutes."}
          pbtn={loading ? "Loading..." : "Start Inspection Now"}
          disabled={loading}
          pbtnPress={() => postCarDetails(selectedImage, selectedImageName)}
          sbtn={"Save for later"}
          sbtnPress={() =>
            postCarDetailsAsDraft(selectedImage, selectedImageName)
          }
        />
      )}
      <InspectionHeader onPress={() => navigation.goBack()}>
        Uploads
      </InspectionHeader>
      <View style={styles.UploadScreenContainer}>
        <AppText fontSize={14} textAlign={"center"}>Upload Car Images</AppText>
        <AppImagePicker
          onImageSelected={handleImageSelected}
          onSelectedImageName={handleImageNameSelected}
          onRemoveImage={handleRemoveImage} // Pass the remove image handler
        />
        <AppText fontSize={14} textAlign={"center"} marginTop={20} >Upload Car Documents</AppText>
        <AppDocumentPicker onDocumentsSelected={setDocumentSelected}/>
        <View style={styles.formButton}>
          <GradientButton onPress={ShowModal} disabled={!isImageUploaded || loading}>
            {loading ? "Loading..." : "Start Inspection"}
          </GradientButton>
        </View>
      </View>
      </ScrollView>
    </AppScreen>
  );
};

export default CarFiles;

const styles = StyleSheet.create({
  UploadScreenContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  addMoreButton: {
    alignItems: "flex-end",
  },
  formButton: {
    marginTop: 10,
    marginBottom: 20,
  },
});
