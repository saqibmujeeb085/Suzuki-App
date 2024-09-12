import { Alert, Keyboard, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppTextInput from "../../components/formFields/TextInput";
import GradientButton from "../../components/buttons/GradientButton";
import { colors } from "../../constants/colors";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Customerform = ({ navigation, route }) => {
  const { carId } = route.params || {};
  const [userData, setUserData] = useContext(AuthContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
      warrantyClaim
    );
  };
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
  };
  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all fields.");
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

    console.log(formData);

    try {
      // Use axios to send the POST request
      const response = await axios.post("/auth/add_customers.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == 200) {
        Alert.alert("Success", `Car Assigned To ${customerName} SuccessFully`, [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
        resetForm();
      } else {
        // Handle errors
        Alert.alert("Error", "Form submission failed. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
              placeholder="CNIC Number"
              inputMode={"numeric"}
              maxLength={15}
              value={cnicNumber}
              onChangeText={setCnicNumber}
            />
            <AppTextInput
              placeholder="Customer Contact"
              inputMode={"numeric"}
              value={customerContact}
              onChangeText={setCustomerContact}
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
            <AppTextInput
              placeholder="Warranty Category"
              value={warrantyCategory}
              onChangeText={setWarrantyCategory}
            />
            <AppTextInput
              placeholder="DMIS sales entry"
              value={dmisSalesEntry}
              onChangeText={setDmisSalesEntry}
            />
            <AppTextInput
              placeholder="Warranty booklet number"
              inputMode={"numeric"}
              value={warrantyBookletNumber}
              onChangeText={setWarrantyBookletNumber}
            />
            <AppTextInput
              placeholder="Transfer slip"
              value={transferSlip}
              onChangeText={setTransferSlip}
            />
            <AppTextInput placeholder="FFS" value={ffs} onChangeText={setFFS} />
            <AppTextInput placeholder="SFS" value={sfs} onChangeText={setSFS} />
            <AppTextInput placeholder="TFS" value={tfs} onChangeText={setTFS} />
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
          Submit
        </GradientButton>
      </View>
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
  inlineFormContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    flexWrap: "nowrap",
    maxWidth: "100%",
  },
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
