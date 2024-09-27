import { Keyboard, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import GradientButton from "../../components/buttons/GradientButton";
import AppTextInput from "../../components/formFields/TextInput";
import InspectionHeader from "../../components/header/InspectionHeader";
import Dropdown from "../../components/formFields/Dropdown";
import { InspecteCarContext } from "../../context/newInspectionContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../../constants/colors";
import { FormDataContext } from "../../context/formDataContext";

const CarBodyDetails = ({ navigation, route }) => {
  const { id } = route.params || {};

  const [carData, setCarData] = useContext(InspecteCarContext);

  const [
    manufacturersData,
    setManufacturersData,
    modelsData,
    setModelsData,
    varientsData,
    setVarientsData,
    yearsData,
    setYearsData,
    colorsData,
    setColorsData,
    fuelsData,
    setFuelsData,
    transmissionsData,
    setTransmissionsData,
    capacitiesData,
    setCapacitiesData,
    citiesData,
    setCitiesData,
  ] = useContext(FormDataContext);

  const [allSelected, setAllSelected] = useState(false);

  console.log(capacitiesData);

  const [fuelType, setFuelType] = useState("");
  const [transmissionsType, setTransmissionsType] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [registrationCity, setRegistrationCity] = useState("");
  const [chasisNo, setChasisNo] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [milage, setMilage] = useState("");
  const [owner, setOwner] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const OwnerSelected = (selected) => {
    setOwner(selected);
  };

  const ownersOptions = [
    {
      key: "1",
      value: "1",
    },
    {
      key: "2",
      value: "2",
    },
    {
      key: "3",
      value: "3",
    },
    {
      key: "4",
      value: "4",
    },
    {
      key: "5",
      value: "5",
    },
  ];

  const FuelTypeSelected = (selected) => {
    setFuelType(selected);
  };
  const TransmissionsTypeSelected = (selected) => {
    setTransmissionsType(selected);
  };
  const EngineCapacitySelected = (selected) => {
    setEngineCapacity(selected);
  };
  const RegistrationCitySelected = (selected) => {
    setRegistrationCity(selected);
  };

  useEffect(() => {
    if (
      chasisNo !== "" &&
      engineNo !== "" &&
      engineCapacity !== "" &&
      transmissionsType !== "" &&
      milage !== "" &&
      registrationCity !== "" &&
      fuelType !== "" &&
      registrationNo !== "" &&
      owner !== ""
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [
    chasisNo,
    engineNo,
    engineCapacity,
    transmissionsType,
    milage,
    registrationCity,
    fuelType,
    registrationNo,
    owner,
  ]);

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

  const addCarDetails = () => {
    if (
      chasisNo !== "" &&
      engineNo !== "" &&
      engineCapacity !== "" &&
      transmissionsType !== "" &&
      milage !== "" &&
      registrationCity !== "" &&
      fuelType !== "" &&
      registrationNo !== "" &&
      owner !== ""
    ) {
      setCarData((prevData) => ({
        ...prevData,
        chasisNo: chasisNo,
        EngineNo: engineNo,
        engineDisplacement: engineCapacity,
        transmissionType: transmissionsType,
        mileage: milage,
        registrationCity: registrationCity,
        FuelType: fuelType,
        registrationNo: registrationNo,
        NoOfOwners: owner,
      }));
      navigation.navigate("CarFiles");
    } else {
      alert("Please Select and Fill All The Fields");
    }
  };

  return (
    <AppScreen>
      <InspectionHeader
        rightText={"Cancel"}
        onPress={() => navigation.goBack()}
      >
        Car Details
      </InspectionHeader>
      <KeyboardAwareScrollView>
        <View style={styles.InspectionformContainer}>
          <View style={styles.FormInputFields}>
            <Dropdown
              DropItems="Registration City"
              Data={citiesData}
              save={"value"}
              selectedItem={RegistrationCitySelected}
              Search={true}
            />

            <Dropdown
              DropItems="No Of Owners"
              Data={ownersOptions}
              save={"value"}
              selectedItem={OwnerSelected}
            />

            <AppTextInput
              placeholder="Registration No"
              onChangeText={(value) => setRegistrationNo(value)}
            />

            <Dropdown
              DropItems="Fuel Type"
              Data={fuelsData}
              save={"value"}
              selectedItem={FuelTypeSelected}
            />
            <View style={styles.inlineFormContainer}>
              <AppTextInput
                placeholder="Chassis No"
                onChangeText={(value) => setChasisNo(value)}
                inputMode={"numeric"}
              />
              <AppTextInput
                placeholder="Engine No"
                onChangeText={(value) => setEngineNo(value)}
                inputMode={"numeric"}
              />
            </View>

            <Dropdown
              DropItems="Transmission Type"
              Data={transmissionsData}
              save={"value"}
              selectedItem={TransmissionsTypeSelected}
            />
            <AppTextInput
              placeholder="Mileage"
              onChangeText={(value) => setMilage(value)}
              inputMode={"numeric"}
            />

            <Dropdown
              DropItems="Engine Capacity"
              Data={capacitiesData[carData.carId] || []}
              save={"value"}
              selectedItem={EngineCapacitySelected}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={[styles.formButton, { bottom: keyboardVisible ? -100 : 0 }]}>
        <GradientButton onPress={addCarDetails} disabled={!allSelected}>
          Next
        </GradientButton>
      </View>
    </AppScreen>
  );
};

export default CarBodyDetails;

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
