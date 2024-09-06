import { StyleSheet, View, Keyboard } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
// import AppTextInput from "../../components/formFields/TextInput";
import GradientButton from "../../components/buttons/GradientButton";
import axios from "axios";
import Dropdown from "../../components/formFields/Dropdown";
import { InspecteCarContext } from "../../context/newInspectionContext";
import { AuthContext } from "../../context/authContext";
import { colors } from "../../constants/colors";
import { FormDataContext } from "../../context/formDataContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppTextInput from "../../components/formFields/TextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditCarInfo = ({ navigation, route }) => {
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

  const { id } = route.params || {};

  const [carInfo, setCarInfo] = useState(null);

  const [manufacturer, setManufacturer] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carVarient, setCarVarient] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carColor, setCarColor] = useState("");
  const [cplc, setCplc] = useState("");

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

  useEffect(() => {
    getCarDataByTempID(`${id}`);
  }, []);

  console.log(carInfo);

  const ManufacturerSelected = (selected) => {
    setManufacturer(selected);
  };
  const CarModelSelected = (selected) => {
    setCarModel(selected);
  };
  const CarVarientSelected = (selected) => {
    setCarVarient(selected);
  };
  const CarYearSelected = (selected) => {
    setCarYear(selected);
  };
  const CarColorSelected = (selected) => {
    setCarColor(selected);
  };
  const CplcSelected = (selected) => {
    setCplc(selected);
  };
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

  const getCarDataByTempID = async (tempID) => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata");

      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);
        const carData = carFormDataArray.find((item) => item.tempID == tempID);
        if (carData) {
          setCarInfo(carData);
          return carData;
        } else {
          console.log("No data found with tempID:", tempID);
          return null;
        }
      } else {
        console.log("No car data found in AsyncStorage");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving car data:", error);
      return null;
    }
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Car Info
      </InspectionHeader>
      <KeyboardAwareScrollView>
        <View style={styles.InspectionformContainer}>
          <Dropdown
            DropItems="Manufacturer"
            Data={manufacturersData}
            save={"key"}
            selectedItem={ManufacturerSelected}
          />

          <Dropdown
            DropItems="Model"
            Data={modelsData[manufacturer] || []}
            save={"key"}
            selectedItem={CarModelSelected}
          />

          <Dropdown
            DropItems="Car Varient"
            Data={varientsData[carModel] || []}
            save={"key"}
            selectedItem={CarVarientSelected}
          />

          <Dropdown
            DropItems="Manufacturing Year"
            Data={yearsData[carModel] || []}
            save={"value"}
            selectedItem={CarYearSelected}
          />

          <Dropdown
            DropItems="Color"
            Data={colorsData}
            save={"value"}
            selectedItem={CarColorSelected}
          />
          <Dropdown
            DropItems="CPLC"
            Data={cplcOptions}
            save={"value"}
            selectedItem={CplcSelected}
          />

          <Dropdown
            DropItems={`Registration City (${carInfo?.registrationNo || ""})`}
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
            placeholder="Milage"
            onChangeText={(value) => setMilage(value)}
            inputMode={"numeric"}
          />

          <Dropdown
            DropItems="Engine Capacity"
            Data={capacitiesData}
            save={"value"}
            selectedItem={EngineCapacitySelected}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={[styles.formButton, { bottom: keyboardVisible ? -100 : 0 }]}>
        <GradientButton onPress={() => {}}>Save</GradientButton>
      </View>
    </AppScreen>
  );
};

export default EditCarInfo;

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
