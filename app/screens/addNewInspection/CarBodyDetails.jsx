import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import GradientButton from "../../components/buttons/GradientButton";
import AppTextInput from "../../components/formFields/TextInput";
import InspectionHeader from "../../components/header/InspectionHeader";
import Dropdown from "../../components/formFields/Dropdown";
import axios from "axios";
import { InspecteCarContext } from "../../context/newInspectionContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CarBodyDetails = ({ navigation }) => {
  const [carData, setCarData] = useContext(InspecteCarContext);

  console.log(carData);

  const [fuelTypes, setFuelTypes] = useState([]);
  const [transmissionsTypes, setTransmissionsTypes] = useState([]);
  const [engineCapacities, setEngineCapacities] = useState([]);
  const [registrationCities, setRegistrationCities] = useState([]);

  const [allSelected, setAllSelected] = useState(false);


  const [fuelType, setFuelType] = useState("");
  const [transmissionsType, setTransmissionsType] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [registrationCity, setRegistrationCity] = useState("");
  const [chasisNo, setChasisNo] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [milage, setMilage] = useState("");
  const [owner, setOwner] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");

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
    fetchFuelTypes();
    fetchTransmissionsTypes();
    fetchEngineCapacity();
    fetchRegistrationCity();
  }, []);


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
  }, [chasisNo, engineNo, engineCapacity, transmissionsType, milage, registrationCity, fuelType, registrationNo, owner]);
  

  const fetchFuelTypes = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_fuelType.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      const FuelTypes = response.data;
      setFuelTypes(
        FuelTypes.map((object) => ({
          key: object.did,
          value: object.type,
        }))
      );
    } catch (error) {
      console.error("Error fetching FuelTypes:", error);
    }
  };

  const fetchTransmissionsTypes = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_cartrans.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      const TransmissionsTypes = response.data;
      setTransmissionsTypes(
        TransmissionsTypes.map((object) => ({
          key: object.did,
          value: object.type,
        }))
      );
    } catch (error) {
      console.error("Error fetching FuelTypes:", error);
    }
  };

  const fetchEngineCapacity = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_engdis.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      const EngineCapacity = response.data;
      setEngineCapacities(
        EngineCapacity.map((object) => ({
          key: object.id,
          value: object.displacement,
        }))
      );
    } catch (error) {
      console.error("Error fetching FuelTypes:", error);
    }
  };

  const fetchRegistrationCity = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_cities.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      const RegistrationCity = response.data;
      setRegistrationCities(
        RegistrationCity.map((object) => ({
          key: object.id,
          value: object.city,
        }))
      );
    } catch (error) {
      console.error("Error fetching FuelTypes:", error);
    }
  };

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
      <InspectionHeader onPress={() => navigation.goBack()}>
        Car Details
      </InspectionHeader>
      <KeyboardAwareScrollView>
        <View style={styles.InspectionformContainer}>
          <View style={styles.FormInputFields}>
          <Dropdown
            DropItems="Registration City"
            Data={registrationCities}
            save={"value"}
            selectedItem={RegistrationCitySelected}
            Search={true}
          />

          <Dropdown
            DropItems="No Of Owners"
            Data={ownersOptions}
            save={"value"}
            selectedItem={OwnerSelected}
            Search={true}
          />

          <AppTextInput
            placeholder="Registration No"
            onChangeText={(value) => setRegistrationNo(value)}
          />

          {/* <AppTextInput placeholder="Fuel Type" /> */}
          <Dropdown
            DropItems="Fuel Type"
            Data={fuelTypes}
            save={"value"}
            selectedItem={FuelTypeSelected}
          />
          <View style={styles.inlineFormContainer}>
            <AppTextInput
              placeholder="Chassis No"
              onChangeText={(value) => setChasisNo(value)}
            />
            <AppTextInput
              placeholder="Engine No"
              onChangeText={(value) => setEngineNo(value)}
            />
          </View>

          {/* <AppTextInput placeholder="Transmission Type" /> */}
          <Dropdown
            DropItems="Transmission Type"
            Data={transmissionsTypes}
            save={"value"}
            selectedItem={TransmissionsTypeSelected}
          />
          <AppTextInput
            placeholder="Milage"
            onChangeText={(value) => setMilage(value)}
          />
          {/* <AppTextInput placeholder="Engine Capacity" /> */}
          <Dropdown
            DropItems="Engine Capacity"
            Data={engineCapacities}
            save={"value"}
            selectedItem={EngineCapacitySelected}
          />
          </View>

          <View style={styles.formButton}>
            <GradientButton onPress={addCarDetails} disabled={!allSelected} >Next</GradientButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  },
  FormInputFields:{
    width: "100%",
    gap: 10,
  },
  inlineFormContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    flexWrap: "nowrap",
    maxWidth: "100%"
  },
  formButton: {
    marginTop: "auto",
  },
});
