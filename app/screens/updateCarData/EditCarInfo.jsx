import { StyleSheet, View, Keyboard, Image } from "react-native";
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
import SingleImagePicker from "../../components/imagePicker/singleImagePicjer";
import AppText from "../../components/text/Text";
import { mainStyles } from "../../constants/style";

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
    provinceData,
    setProvinceData,
    chasisData,
    setChasisData,
    engineData,
    setEngineData,
  ] = useContext(FormDataContext);

  const { id } = route.params || {};

  const [carInfo, setCarInfo] = useState(null);

  useEffect(() => {
    getCarDataByTempID(`${id}`);
  }, []);

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
  const [provienceNew, setProvience] = useState("");
  const [vinImageNew, setVinImage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // New states for manufacturer, model, and variant names
  const [manufacturerName, setManufacturerName] = useState("");
  const [carModelName, setCarModelName] = useState("");
  const [carVarientName, setCarVarientName] = useState("");

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

  const handleImageSelected = (image) => {
    setVinImage(image); // set the vinImage state with the selected image
  };

  const handleRemoveImage = () => {
    setVinImage(null); // Remove the image from state when it's removed
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
      setProvience(carInfo?.province || "");

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

  const chasisCode = chasisData?.[carModel]?.[0]?.value || "";
  const engineCode = engineData?.[carModel]?.[0]?.value || "";
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
              province: provienceNew,
              vinImage: vinImageNew ? vinImageNew : carInfo.vinImage,
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
        <View style={{ marginBottom: 20 }}>
          <AppText
            color={colors.red}
            textAlign={"center"}
            fontFamily={mainStyles.appFontBold}
          >
            Just Select Those Fields You Want To Change
          </AppText>
        </View>
        <View style={styles.InspectionformContainer}>
          <Dropdown
            DropItems={"Select Manufacturer"} // Displayed item
            Data={manufacturersData} // Dropdown options
            save={"key"}
            selectedItem={setManufacturer} // State update function
          />

          <Dropdown
            DropItems={"Select Car Model"}
            Data={modelsData[manufacturer] || []}
            save={"key"}
            selectedItem={setCarModel}
          />

          <Dropdown
            DropItems={"Select Car Varient"}
            Data={varientsData[carModel] || []}
            save={"key"}
            selectedItem={setCarVarient}
          />

          <Dropdown
            DropItems={"Select Car Year"}
            Data={yearsData[carModel] || []}
            save={"value"}
            selectedItem={setCarYear}
          />

          <Dropdown
            DropItems={"Select Car Color"}
            Data={colorsData}
            save={"value"}
            selectedItem={setCarColor}
          />

          <Dropdown
            DropItems={"Select CPLC"}
            Data={[
              { key: "Cleared", value: "Cleared" },
              { key: "Non-Cleared", value: "Non-Cleared" },
            ]}
            save={"value"}
            selectedItem={setCplc}
            placeholder={cplc}
          />

          <Dropdown
            DropItems={"Select Registration City"}
            Data={citiesData}
            save={"value"}
            selectedItem={setRegistrationCity}
            Search={true}
          />

          <Dropdown
            DropItems={"Select Province"}
            Data={provinceData}
            save={"value"}
            selectedItem={setProvience}
          />

          <Dropdown
            DropItems={"Select No Of Owner"}
            Data={[
              { key: "1", value: "1" },
              { key: "2", value: "2" },
              { key: "3", value: "3" },
              { key: "4", value: "4" },
              { key: "5", value: "5" },
            ]}
            save={"value"}
            selectedItem={setOwner}
          />

          <AppTextInput
            placeholder={`Registration no: ${registrationNo}`}
            onChangeText={(value) => setRegistrationNoNew(value)}
            val={registrationNoNew}
          />

          <Dropdown
            DropItems={"Select fuelType"}
            Data={fuelsData}
            save={"value"}
            selectedItem={setFuelType}
          />

          <AppTextInput
            placeholder={`Chasis No After ${chasisCode}`}
            onChangeText={(value) => setChasisNoNew(value)}
            val={chasisNoNew}
          />
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            {vinImageNew == "" || vinImageNew == null ? (
              <Image
                source={{ uri: carInfo?.vinImage.uri }}
                style={{
                  justifyContent: "cover",
                  height: 65,
                  width: 65,
                  borderRadius: 5,
                }}
              />
            ) : (
              ""
            )}
            <SingleImagePicker
              onImageSelected={handleImageSelected}
              onRemoveImage={handleRemoveImage}
            />
          </View>
          <AppTextInput
            placeholder={`Engine No After ${engineCode}`}
            onChangeText={(value) => setEngineNoNew(value)}
            val={engineNoNew}
          />

          <Dropdown
            DropItems={"Select TransmissionsType"}
            Data={transmissionsData}
            save={"value"}
            selectedItem={setTransmissionsType}
          />

          <AppTextInput
            placeholder={`Milage: ${milage}`}
            onChangeText={(value) => setMilageNew(value)}
            val={milageNew}
          />

          <Dropdown
            DropItems={"Select EngineCapacity"}
            Data={capacitiesData}
            save={"value"}
            selectedItem={setEngineCapacity}
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
