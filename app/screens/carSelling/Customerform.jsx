import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
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
import { AntDesign } from "@expo/vector-icons";

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

    try {
      // Use axios to send the POST request
      const response = await axios.post("/auth/add_customers.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == 200) {
        Alert.alert("Success", `Car Assigned To ${customerName} Successfully`, [
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

  // Keyboard event listener for adjusting button positioning
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

  const warrantyData = [
    { key: 1, value: "A" },
    { key: 2, value: "B" },
    { key: 3, value: "C" },
    { key: 4, value: "D" },
  ];
  const WarrantySelected = (selected) => {
    setWarrantyCategory(selected);
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
              Data={warrantyData}
              save={"value"}
              selectedItem={WarrantySelected}
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
            {/* Transfer Slip Date Picker */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setTransferSlipVisible(true)}
                  style={{
                    width: "80%",
                    borderRightWidth: 1,
                    borderColor: colors.ligtGreyBg,
                  }}
                >
                  <AppText
                    color={colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {transferSlip
                      ? transferSlip
                      : "Transfer Slip Date (--/--/----)"}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.ligtGreyBg,
                    height: 40,
                    width: "17%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <AntDesign name="camerao" size={24} color={colors.fontGrey} />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isTransferSlipVisible}
                mode="date"
                onConfirm={handleConfirmTransferSlip}
                onCancel={() => setTransferSlipVisible(false)}
              />
            </View>

            {/* SFS Date Picker */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setSfsVisible(true)}
                  style={{
                    width: "80%",
                    borderRightWidth: 1,
                    borderColor: colors.ligtGreyBg,
                  }}
                >
                  <AppText
                    color={colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {sfs ? sfs : "SFS Date (--/--/----)"}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.ligtGreyBg,
                    height: 40,
                    width: "17%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <AntDesign name="camerao" size={24} color={colors.fontGrey} />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isSfsVisible}
                mode="date"
                onConfirm={handleConfirmSfs}
                onCancel={() => setSfsVisible(false)}
              />
            </View>

            {/* TFS Date Picker */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setTfsVisible(true)}
                  style={{
                    width: "80%",
                    borderRightWidth: 1,
                    borderColor: colors.ligtGreyBg,
                  }}
                >
                  <AppText
                    color={colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {tfs ? tfs : "TFS Date (--/--/----)"}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.ligtGreyBg,
                    height: 40,
                    width: "17%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <AntDesign name="camerao" size={24} color={colors.fontGrey} />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isTfsVisible}
                mode="date"
                onConfirm={handleConfirmTfs}
                onCancel={() => setTfsVisible(false)}
              />
            </View>

            {/* FFS Date Picker */}
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerButton}>
                <TouchableOpacity
                  onPress={() => setFfs(true)}
                  style={{
                    width: "80%",
                    borderRightWidth: 1,
                    borderColor: colors.ligtGreyBg,
                  }}
                >
                  <AppText
                    color={colors.fontGrey}
                    padding={10}
                    textAlign={"start"}
                    fontSize={mainStyles.h2FontSize}
                  >
                    {ffs ? ffs : "FFS Date (--/--/----)"}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.ligtGreyBg,
                    height: 40,
                    width: "17%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <AntDesign name="camerao" size={24} color={colors.fontGrey} />
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
  datePickerButton: {
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    elevation: 2,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
