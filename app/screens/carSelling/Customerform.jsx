import {
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppTextInput from "../../components/formFields/TextInput";
import GradientButton from "../../components/buttons/GradientButton";
import { colors } from "../../constants/colors";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import Dropdown from "../../components/formFields/Dropdown";
import AppText from "../../components/text/Text";
import { mainStyles } from "../../constants/style";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

const Customerform = ({ navigation, route }) => {
  const { carId } = route.params || {};
  const [userData, setUserData] = useContext(AuthContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [sending, setSending] = useState(false);
  // Define state variables for all input fields
  const [customerName, setCustomerName] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [warrantyCategory, setWarrantyCategory] = useState("");
  const [dmisSalesEntry, setDmisSalesEntry] = useState("");
  const [warrantyBookletNumber, setWarrantyBookletNumber] = useState("");
  const [transferSlip, setTransferSlip] = useState("");
  const [ffs, setFFS] = useState("");
  const [sfs, setSFS] = useState("");
  const [tfs, setTFS] = useState("");
  const [warrantyClaim, setWarrantyClaim] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // States to hold image URIs
  const [transferSlipImage, setTransferSlipImage] = useState(null);
  const [ffsImage, setFfsImage] = useState(null);
  const [sfsImage, setSfsImage] = useState(null);
  const [tfsImage, setTfsImage] = useState(null);

  // Date picker visibility states
  const [isFfs, setFfs] = useState(false);
  const [isTransferSlipVisible, setTransferSlipVisible] = useState(false);
  const [isSfsVisible, setSfsVisible] = useState(false);
  const [isTfsVisible, setTfsVisible] = useState(false);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      customerName &&
      cnicNumber &&
      customerContact &&
      customerAddress &&
      salePrice &&
      warrantyCategory &&
      dmisSalesEntry &&
      warrantyBookletNumber &&
      transferSlip &&
      ffs &&
      sfs &&
      tfs &&
      warrantyClaim &&
      transferSlipImage &&
      ffsImage &&
      sfsImage &&
      tfsImage
    );
  };

  console.log(ffsImage);

  const resetForm = () => {
    setCustomerName("");
    setCnicNumber("");
    setCustomerContact("");
    setCustomerAddress("");
    setSalePrice("");
    setWarrantyCategory("");
    setDmisSalesEntry("");
    setWarrantyBookletNumber("");
    setTransferSlip("");
    setFFS("");
    setSFS("");
    setTFS("");
    setWarrantyClaim("");
    setTransferSlipImage(null);
    setFfsImage(null);
    setSfsImage(null);
    setTfsImage(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSending(true);
    if (!isFormValid()) {
      console.log("Error", "Please fill in all fields.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("duser_id", userData.user.duserid);
    formData.append("inspectionId", carId);
    formData.append("name", customerName);
    formData.append("cnic", cnicNumber);
    formData.append("contact", customerContact);
    formData.append("address", customerAddress);
    formData.append("sale_price", salePrice);
    formData.append("warranty_category", warrantyCategory);
    formData.append("dmis", dmisSalesEntry);
    formData.append("booklet_number", warrantyBookletNumber);
    formData.append("slip", transferSlip);
    formData.append("ffs", ffs);
    formData.append("sfs", sfs);
    formData.append("tfs", tfs);
    formData.append("warranty_claim", warrantyClaim);

    formData.append("transfer_slip_image", {
      uri: transferSlipImage.uri,
      name: transferSlipImage.fileName,
      type: "image/jpeg",
    });
    formData.append("ffs_image", {
      uri: ffsImage.uri,
      name: ffsImage.fileName,
      type: "image/jpeg",
    });
    formData.append("sfs_image", {
      uri: sfsImage.uri,
      name: sfsImage.fileName,
      type: "image/jpeg",
    });
    formData.append("tfs_image", {
      uri: tfsImage.uri,
      name: tfsImage.fileName,
      type: "image/jpeg",
    });

    try {
      // Use axios to send the POST request
      const response = await axios.post("/auth/add_customers.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == 200) {
        setSending(false);
        Alert.alert("Success", `Car Assigned To ${customerName} Successfully`, [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);

        resetForm();
      } else {
        // Handle errors
        console.log("Error", "Form submission failed. Please try again.");
      }
    } catch (error) {
      console.log("Error", "An error occurred. Please try again later.");
    }
  };

  const openCamera = async (setImageFunction) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0]);
    }
  };

  const cnicFormat = (value) => {
    // Remove non-alphanumeric characters except "/"
    let cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Create an array of segments to format
    let segments = [];

    if (cleanedValue.length > 0) segments.push(cleanedValue.slice(0, 5)); // First 5 digits
    if (cleanedValue.length > 5) segments.push(cleanedValue.slice(5, 12)); // Next 7 digits
    if (cleanedValue.length > 12) segments.push(cleanedValue.slice(12, 15)); // Last 3 digits

    // Join segments with dashes
    return segments.join("-");
  };

  const handleInputChange = (value) => {
    const formattedValue = cnicFormat(value);
    setCnicNumber(formattedValue);
  };

  const phoneNumberFormat = (value) => {
    // Remove non-numeric characters
    let cleanedValue = value.replace(/[^0-9]/g, "");

    // Create an array of segments to format
    let segments = [];

    if (cleanedValue.length > 0) segments.push(cleanedValue.slice(0, 4)); // First 4 digits (03xx)
    if (cleanedValue.length > 4) segments.push(cleanedValue.slice(4, 11)); // Next 7 digits (xxxxxxx)

    // Join segments with a hyphen
    return segments.join("-");
  };

  const handlePhoneInputChange = (value) => {
    const formattedValue = phoneNumberFormat(value);
    setCustomerContact(formattedValue);
  };

  const dmisFormat = (value) => {
    // Remove non-numeric characters
    let cleanedValue = value.replace(/[^0-9]/g, "");

    // Create an array of segments to format
    let segments = [];

    if (cleanedValue.length > 0) segments.push(cleanedValue.slice(0, 2)); // First 2 digits
    if (cleanedValue.length > 2) segments.push(cleanedValue.slice(2, 7)); // Next 5 digits

    // Join segments with a slash
    return segments.join("/");
  };

  const handleDmisInputChange = (value) => {
    const formattedValue = dmisFormat(value);
    setDmisSalesEntry(formattedValue);
  };

  const handleConfirmFfs = (date) => {
    setFFS(date.toLocaleDateString());
    setFfs(false);
  };

  const handleConfirmTransferSlip = (date) => {
    setTransferSlip(date.toLocaleDateString());
    setTransferSlipVisible(false);
  };

  const handleConfirmSfs = (date) => {
    setSFS(date.toLocaleDateString());
    setSfsVisible(false);
  };

  const handleConfirmTfs = (date) => {
    setTFS(date.toLocaleDateString());
    setTfsVisible(false);
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Vehicle Sale Profile
      </InspectionHeader>
      <KeyboardAwareScrollView>
        <View style={styles.InspectionformContainer}>
          <View style={styles.FormInputFields}>
            <AppTextInput
              placeholder="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
            <AppTextInput
              placeholder="CNIC Number (xxxxx-xxxxxxx-x)"
              inputMode={"numeric"}
              maxLength={15}
              value={cnicNumber}
              onChangeText={handleInputChange}
            />
            <AppTextInput
              placeholder="Customer Contact (03xx-xxxxxxx)"
              inputMode={"numeric"}
              maxLength={12}
              value={customerContact}
              onChangeText={handlePhoneInputChange}
            />
            <AppTextInput
              placeholder="Customer Address"
              inputMode={"textArea"}
              multiline
              numberOfLines={3}
              textAlignVertical={"top"}
              value={customerAddress}
              onChangeText={setCustomerAddress}
            />
            <AppTextInput
              placeholder="Sale Price"
              inputMode={"numeric"}
              value={salePrice}
              onChangeText={setSalePrice}
            />
            <Dropdown
              DropItems="Warranty Category"
              Data={[
                { key: 1, value: "A" },
                { key: 2, value: "B" },
                { key: 3, value: "C" },
                { key: 4, value: "D" },
              ]}
              save={"value"}
              selectedItem={(selected) => setWarrantyCategory(selected)}
            />
            <AppTextInput
              placeholder="DMIS sales entry (00/00000)"
              inputMode={"numeric"}
              value={dmisSalesEntry}
              onChangeText={handleDmisInputChange}
            />
            <AppTextInput
              placeholder="Warranty booklet number (0000)"
              inputMode={"numeric"}
              value={warrantyBookletNumber}
              onChangeText={setWarrantyBookletNumber}
              maxLength={4}
            />

            {/* Transfer Slip Date Picker and Camera */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setTransferSlipVisible(true)}
                  style={styles.datePickerTouchable}
                >
                  <AppText
                    color={colors.fontGrey}
                    position={"absolute"}
                    top={!transferSlip ? 10 : -7}
                    left={10}
                    fontSize={
                      !transferSlip
                        ? mainStyles.h2FontSize
                        : mainStyles.h3FontSize
                    }
                  >
                    Transfer Slip Date
                  </AppText>
                  <AppText
                    color={transferSlip ? colors.fontBlack : colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {transferSlip && transferSlip}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    transferSlipImage
                      ? () => openImageModal(transferSlipImage.uri)
                      : () => openCamera(setTransferSlipImage)
                  }
                  style={styles.cameraButton}
                >
                  {transferSlipImage ? (
                    <Image
                      source={{ uri: transferSlipImage.uri }}
                      style={styles.imageThumbnail}
                    />
                  ) : (
                    <AntDesign
                      name="camerao"
                      size={24}
                      color={colors.fontGrey}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isTransferSlipVisible}
                mode="date"
                onConfirm={handleConfirmTransferSlip}
                onCancel={() => setTransferSlipVisible(false)}
              />
            </View>

            {/* SFS Date Picker and Camera */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setSfsVisible(true)}
                  style={styles.datePickerTouchable}
                >
                  <AppText
                    color={colors.fontGrey}
                    position={"absolute"}
                    top={!sfs ? 10 : -7}
                    left={10}
                    fontSize={
                      !sfs ? mainStyles.h2FontSize : mainStyles.h3FontSize
                    }
                  >
                    SFS Date
                  </AppText>
                  <AppText
                    color={sfs ? colors.fontBlack : colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {sfs && sfs}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    sfsImage
                      ? () => openImageModal(sfsImage.uri)
                      : () => openCamera(setSfsImage)
                  }
                  style={styles.cameraButton}
                >
                  {sfsImage ? (
                    <Image
                      source={{ uri: sfsImage.uri }}
                      style={styles.imageThumbnail}
                    />
                  ) : (
                    <AntDesign
                      name="camerao"
                      size={24}
                      color={colors.fontGrey}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isSfsVisible}
                mode="date"
                onConfirm={handleConfirmSfs}
                onCancel={() => setSfsVisible(false)}
              />
            </View>

            {/* TFS Date Picker and Camera */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setTfsVisible(true)}
                  style={styles.datePickerTouchable}
                >
                  <AppText
                    color={colors.fontGrey}
                    position={"absolute"}
                    top={!tfs ? 10 : -7}
                    left={10}
                    fontSize={
                      !tfs ? mainStyles.h2FontSize : mainStyles.h3FontSize
                    }
                  >
                    TFS Date
                  </AppText>
                  <AppText
                    color={tfs ? colors.fontBlack : colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {tfs && tfs}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    tfsImage
                      ? () => openImageModal(tfsImage.uri)
                      : () => openCamera(setTfsImage)
                  }
                  style={styles.cameraButton}
                >
                  {tfsImage ? (
                    <Image
                      source={{ uri: tfsImage.uri }}
                      style={styles.imageThumbnail}
                    />
                  ) : (
                    <AntDesign
                      name="camerao"
                      size={24}
                      color={colors.fontGrey}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isTfsVisible}
                mode="date"
                onConfirm={handleConfirmTfs}
                onCancel={() => setTfsVisible(false)}
              />
            </View>

            {/* FFS Date Picker and Camera */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setFfs(true)}
                  style={styles.datePickerTouchable}
                >
                  <AppText
                    color={colors.fontGrey}
                    position={"absolute"}
                    top={!ffs ? 10 : -7}
                    left={10}
                    fontSize={
                      !ffs ? mainStyles.h2FontSize : mainStyles.h3FontSize
                    }
                  >
                    FFS Date
                  </AppText>
                  <AppText
                    color={ffs ? colors.fontBlack : colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {ffs && ffs}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    ffsImage
                      ? () => openImageModal(ffsImage.uri)
                      : () => openCamera(setFfsImage)
                  }
                  style={styles.cameraButton}
                >
                  {ffsImage ? (
                    <Image
                      source={{ uri: ffsImage.uri }}
                      style={styles.imageThumbnail}
                    />
                  ) : (
                    <AntDesign
                      name="camerao"
                      size={24}
                      color={colors.fontGrey}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isFfs}
                mode="date"
                onConfirm={handleConfirmFfs}
                onCancel={() => setFfs(false)}
              />
            </View>

            <AppTextInput
              placeholder="Warranty claim"
              value={warrantyClaim}
              onChangeText={setWarrantyClaim}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.formButton, { bottom: keyboardVisible ? -100 : 0 }]}>
        <GradientButton onPress={handleSubmit} disabled={!isFormValid()}>
          {!sending ? (
            "Submit"
          ) : (
            <ActivityIndicator color={"#FFFFFF"} size={20} />
          )}
        </GradientButton>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close modal when back is pressed
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              position: "relative",
              height: "60%",
              width: "90%",
              borderRadius: 15,
              padding: 10,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.fontWhite}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Image
              source={{
                uri: selectedImage,
              }}
              style={{
                objectFit: "contain",
                flex: 1,
                width: "100%",
                borderRadius: 5,
                overflow: "hidden",
              }}
            />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
};

export default Customerform;

const styles = StyleSheet.create({
  InspectionformContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 120,
  },
  FormInputFields: {
    width: "100%",
    gap: 10,
  },
  datePickerButton: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    elevation: 2,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerTouchable: {
    width: "80%",
    borderRightWidth: 1,
    borderColor: colors.ligtGreyBg,
    position: "relative",
  },

  cameraButton: {
    backgroundColor: colors.ligtGreyBg,
    height: 40,
    width: "17%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  imageThumbnail: {
    width: "100%",
    height: 40,
    borderRadius: 5,
  },
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 100,
    height: 30,
    width: 30,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
});
