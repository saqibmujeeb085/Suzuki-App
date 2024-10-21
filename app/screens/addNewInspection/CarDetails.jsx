import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import InspectionHeader from "../../components/header/InspectionHeader";
import GradientButton from "../../components/buttons/GradientButton";
import Dropdown from "../../components/formFields/Dropdown";
import { InspecteCarContext } from "../../context/newInspectionContext";
import { AuthContext } from "../../context/authContext";
import { colors } from "../../constants/colors";
import { FormDataContext } from "../../context/formDataContext";

const CarDetails = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);

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
    provinceData,
    setProvinceData,
    chasisData,
    setChasisData,
    engineData,
    setEngineData,
  ] = useContext(FormDataContext);

  console.log(varientsData);

  const [carData, setCarData] = useContext(InspecteCarContext);

  const [allSelected, setAllSelected] = useState(false);

  const [manufacturer, setManufacturer] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carVarient, setCarVarient] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carColor, setCarColor] = useState("");

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

  useEffect(() => {
    if (
      manufacturer !== "" &&
      carModel !== "" &&
      carYear !== "" &&
      carColor !== ""
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [manufacturer, carModel, carYear, carColor]);

  const addCarDetails = () => {
    setCarData((prevData) => ({
      ...prevData,
      dealershipId: userData.user.dId,
      duserId: userData.user.duserid,
      mfgId: manufacturer,
      carId: carModel,
      varientId: carVarient,
      model: carYear,
      color: carColor,
    }));
    navigation.navigate("CarBodyDetails");
  };

  return (
    <AppScreen>
      <InspectionHeader
        rightText={"Cancel"}
        // rightOnpress={() => navigation.navigate("Home")}
        onPress={() => navigation.goBack()}
      >
        Car Info
      </InspectionHeader>
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
          DropItems="Car Variant"
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
      </View>
      <View style={styles.formButton}>
        <GradientButton onPress={addCarDetails} disabled={!allSelected}>
          Next
        </GradientButton>
      </View>
    </AppScreen>
  );
};

export default CarDetails;

const styles = StyleSheet.create({
  InspectionformContainer: {
    gap: 10,
    paddingHorizontal: 20,
  },
  formButton: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
    backgroundColor: colors.ligtGreyBg,
  },
});
