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
import SingleImagePicker from "../../components/imagePicker/singleImagePicjer";

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
    provinceData,
    setProvinceData,
    chasisData,
    setChasisData,
    engineData,
    setEngineData,
  ] = useContext(FormDataContext);

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
  const [province, setProvince] = useState("");

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
  const [vinImage, setVinImage] = useState(null);

  const handleImageSelected = (image) => {
    setVinImage(image); // set the vinImage state with the selected image
  };

  const handleRemoveImage = (image) => {
    setVinImage(null); // Remove the image from state when it's removed
  };

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

  const ProvinceSelected = (selected) => {
    setProvince(selected);
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
      owner !== "" &&
      province !== "" &&
      vinImage !== null // check for null instead of empty string
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
    province,
    vinImage, // Add vinImage to the dependency array
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

  // Ensure safe access to chasisData and engineData
  const chasisCode = chasisData?.[carData?.carId]?.[0]?.value || "";
  const engineCode = engineData?.[carData?.carId]?.[0]?.value || "";

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
      owner !== "" &&
      province !== "" &&
      vinImage !== null // Check for vinImage null
    ) {
      setCarData((prevData) => {
        const updatedData = {
          ...prevData,
          chasisNo: `${chasisCode}-${chasisNo}`,
          EngineNo: `${engineCode}-${engineNo}`,
          engineDisplacement: engineCapacity,
          transmissionType: transmissionsType,
          mileage: milage,
          registrationCity: registrationCity,
          FuelType: fuelType,
          registrationNo: registrationNo,
          NoOfOwners: owner,
          province: province,
          vinImage: vinImage,
        };
        console.log("new Data", updatedData); // Log the new data correctly
        return updatedData;
      });

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
              DropItems="Province"
              Data={provinceData}
              save={"value"}
              selectedItem={ProvinceSelected}
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
              val={registrationNo}
            />

            <Dropdown
              DropItems="Fuel Type"
              Data={fuelsData}
              save={"value"}
              selectedItem={FuelTypeSelected}
            />

            <AppTextInput
              placeholder={`Chassis No After (${
                chasisData?.[carData?.carId]?.[0]?.value || ""
              })`}
              onChangeText={(value) => setChasisNo(value)}
              val={chasisNo}
            />
            <AppTextInput
              placeholder={`Engine No After (${
                engineData?.[carData?.carId]?.[0]?.value || ""
              })`}
              onChangeText={(value) => setEngineNo(value)}
              inputMode={"numeric"}
              val={engineNo}
            />
            <SingleImagePicker
              onImageSelected={handleImageSelected}
              onRemoveImage={handleRemoveImage}
            />

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
              val={milage}
            />

            <Dropdown
              DropItems="Engine Capacity"
              Data={capacitiesData?.[carData?.carId] || []}
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
