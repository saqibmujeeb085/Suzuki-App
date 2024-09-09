import { StyleSheet, View, Keyboard } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import GradientButton from "../../components/buttons/GradientButton";
import Dropdown from "../../components/formFields/Dropdown";
import { FormDataContext } from "../../context/formDataContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppTextInput from "../../components/formFields/TextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../constants/colors";

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
  const [chasisNoNew, setChasisNoNew] = useState("");
  const [chasisNo, setChasisNo] = useState("");
  const [engineNoNew, setEngineNoNew] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [milage, setMilage] = useState("");
  const [milageNew, setMilageNew] = useState("");
  const [owner, setOwner] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [registrationNoNew, setRegistrationNoNew] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // New states for manufacturer, model, and variant names
  const [manufacturerName, setManufacturerName] = useState("");
  const [carModelName, setCarModelName] = useState("");
  const [carVarientName, setCarVarientName] = useState("");

  useEffect(() => {
    getCarDataByTempID(`${id}`);
  }, []);

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

  // Get Manufacturer, Model, and Variant functions
  const getManufacturer = (manufacturerId) => {
    if (manufacturersData) {
      const m = manufacturersData.find((item) => item.key === manufacturerId);
      return m ? m.value : "Unknown Manufacturer";
    }
  };

  const getCarModel = (carId, manufacturerId) => {
    const models = modelsData[manufacturerId];
    if (models) {
      const model = models.find((item) => item.key === carId);
      return model ? model.value : "Unknown Model";
    }
    return "Unknown Model";
  };

  const getCarVarient = (varientId, carId) => {
    const v = varientsData[carId];
    if (v) {
      const varient = v.find((item) => item.key === varientId);
      return varient ? varient.value : "Unknown Varient";
    }
    return "Unknown Model";
  };

  useEffect(() => {
    if (carInfo) {
      setManufacturer(carInfo?.mfgId || "");
      setCarModel(carInfo?.carId || "");
      setCarVarient(carInfo?.varientId || "");
      setCarYear(carInfo?.model || "");
      setCarColor(carInfo?.color || "");
      setCplc(carInfo?.cplc || "");
      setFuelType(carInfo?.FuelType || "");
      setTransmissionsType(carInfo?.transmissionType || "");
      setEngineCapacity(carInfo?.engineDisplacement || "");
      setRegistrationCity(carInfo?.registrationCity || "");
      setChasisNo(carInfo?.chasisNo || "");
      setEngineNo(carInfo?.EngineNo || "");
      setMilage(carInfo?.mileage || "");
      setOwner(carInfo?.NoOfOwners || "");
      setRegistrationNo(carInfo?.registrationNo || "");

      // Update manufacturer, model, and variant names
      setManufacturerName(getManufacturer(carInfo?.mfgId));
      setCarModelName(getCarModel(carInfo?.carId, carInfo?.mfgId));
      setCarVarientName(getCarVarient(carInfo?.varientId, carInfo?.carId));
    }
  }, [carInfo]);

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

  const updateCarData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carformdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);
        const updatedCarData = carFormDataArray.map((car) => {
          if (car.tempID == id) {
            return {
              ...car,
              mfgId: manufacturer,
              carId: carModel,
              varientId: carVarient,
              model: carYear,
              color: carColor,
              cplc: cplc,
              FuelType: fuelType,
              transmissionType: transmissionsType,
              engineDisplacement: engineCapacity,
              registrationCity: registrationCity,
              chasisNo: chasisNoNew ? chasisNoNew : chasisNo,
              EngineNo: engineNoNew ? engineNoNew : engineNo,
              mileage: milageNew ? milageNew : milage,
              NoOfOwners: owner,
              registrationNo: registrationNoNew
                ? registrationNoNew
                : registrationNo,
            };
          }
          return car;
        });
        await AsyncStorage.setItem(
          "@carformdata",
          JSON.stringify(updatedCarData)
        );
        console.log("Car data updated successfully!");
      }
      navigation.navigate("ViewReport", {
        id: `${id}`,
      });
    } catch (error) {
      console.error("Error updating car data:", error);
    }
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Edit Car Info
      </InspectionHeader>
      <KeyboardAwareScrollView>
        <View style={styles.InspectionformContainer}>
          <Dropdown
            DropItems={manufacturerName}
            Data={manufacturersData}
            save={"key"}
            selectedItem={setManufacturer}
            placeholder={`Manufacturer (${
              manufacturerName || "Select Manufacturer"
            })`}
          />

          <Dropdown
            DropItems={carModelName}
            Data={modelsData[manufacturer] || []}
            save={"key"}
            selectedItem={setCarModel}
            placeholder={`Model (${carModelName || "Select Model"})`}
          />

          <Dropdown
            DropItems={carVarientName}
            Data={varientsData[carModel] || []}
            save={"key"}
            selectedItem={setCarVarient}
            placeholder={`Car Varient (${carVarientName || "Select Varient"})`}
          />

          <Dropdown
            DropItems={carYear}
            Data={yearsData[carModel] || []}
            save={"value"}
            selectedItem={setCarYear}
            placeholder={`Manufacturing Year (${carYear || "Select Year"})`}
          />

          <Dropdown
            DropItems={carColor}
            Data={colorsData}
            save={"value"}
            selectedItem={setCarColor}
            placeholder={`Color (${carColor || "Select Color"})`}
          />

          <Dropdown
            DropItems={cplc}
            Data={[
              { key: "Cleared", value: "Cleared" },
              { key: "Non-Cleared", value: "Non-Cleared" },
            ]}
            save={"value"}
            selectedItem={setCplc}
            placeholder={cplc}
          />

          <Dropdown
            DropItems={registrationCity}
            Data={citiesData}
            save={"value"}
            selectedItem={setRegistrationCity}
            placeholder={`Registration City (${
              registrationCity || "Select City"
            })`}
            Search={true}
          />

          <Dropdown
            DropItems={owner}
            Data={[
              { key: "1", value: "1" },
              { key: "2", value: "2" },
              { key: "3", value: "3" },
              { key: "4", value: "4" },
              { key: "5", value: "5" },
            ]}
            save={"value"}
            selectedItem={setOwner}
            placeholder={`No Of Owners (${owner || "Select No Of Owners"})`}
          />

          <AppTextInput
            placeholder={`Registration no: ${registrationNo}`}
            onChangeText={(value) => setRegistrationNoNew(value)}
          />

          <Dropdown
            DropItems={fuelType}
            Data={fuelsData}
            save={"value"}
            selectedItem={setFuelType}
            placeholder={`Fuel Type (${fuelType || "Select Fuel Type"})`}
          />

          <View style={styles.inlineFormContainer}>
            <AppTextInput
              placeholder={`Chasis no: ${chasisNo}`}
              onChangeText={(value) => setChasisNoNew(value)}
              inputMode={"numeric"}
            />
            <AppTextInput
              placeholder={`Engine No: (${engineNo || "Enter Engine No"})`}
              onChangeText={(value) => setEngineNoNew(value)}
              inputMode={"numeric"}
            />
          </View>

          <Dropdown
            DropItems={transmissionsType}
            Data={transmissionsData}
            save={"value"}
            selectedItem={setTransmissionsType}
            placeholder={`Transmission Type (${
              transmissionsType || "Select Transmission Type"
            })`}
          />

          <AppTextInput
            placeholder={`Milage: ${milage}`}
            onChangeText={(value) => setMilageNew(value)}
            inputMode={"numeric"}
          />

          <Dropdown
            DropItems={engineCapacity}
            Data={capacitiesData}
            save={"value"}
            selectedItem={setEngineCapacity}
            placeholder={`Engine Capacity (${
              engineCapacity || "Select Engine Capacity"
            })`}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={[styles.formButton, { bottom: keyboardVisible ? -100 : 0 }]}>
        <GradientButton onPress={updateCarData}>Save</GradientButton>
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
    bottom: 0,
    backgroundColor: colors.ligtGreyBg,
  },
});
