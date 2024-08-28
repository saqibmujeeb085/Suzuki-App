import { Keyboard, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppTextInput from "../../components/formFields/TextInput";
import GradientButton from "../../components/buttons/GradientButton";
import { colors } from "../../constants/colors";

const Customerform = ({ navigation }) => {
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

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Vehicale Sale Profile
      </InspectionHeader>
      <KeyboardAwareScrollView>
        <View style={styles.InspectionformContainer}>
          <View style={styles.FormInputFields}>
            <AppTextInput placeholder="Customer Name" onChangeText={() => {}} />
            <AppTextInput
              placeholder="CNIC Number"
              inputMode={"numeric"}
              lemaxLength={15}
              onChangeText={() => {}}
            />
            <AppTextInput
              placeholder="Customer Contact"
              inputMode={"numeric"}
              onChangeText={() => {}}
            />
            <AppTextInput
              placeholder="Customer Address"
              inputMode={"textArea"}
              multiline
              numberOfLines={3}
              textAlignVertical={"top"}
              onChangeText={() => {}}
            />
            <AppTextInput
              placeholder="Sale Price"
              inputMode={"numeric"}
              onChangeText={() => {}}
            />
            <AppTextInput
              placeholder="Warranty Category"
              onChangeText={() => {}}
            />
            <AppTextInput
              placeholder="DMIS sales entry"
              onChangeText={() => {}}
            />
            <AppTextInput
              placeholder="Warranty booklet number"
              onChangeText={() => {}}
              inputMode={"numeric"}
            />
            <AppTextInput placeholder="Transfer slip" onChangeText={() => {}} />
            <AppTextInput placeholder="FFS" onChangeText={() => {}} />
            <AppTextInput placeholder="SFS" onChangeText={() => {}} />
            <AppTextInput placeholder="TFS" onChangeText={() => {}} />
            <AppTextInput
              placeholder="Warranty claim"
              onChangeText={() => {}}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={[styles.formButton, { bottom: keyboardVisible ? -100 : 0 }]}>
        <GradientButton onPress={() => {}}>Submit</GradientButton>
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
