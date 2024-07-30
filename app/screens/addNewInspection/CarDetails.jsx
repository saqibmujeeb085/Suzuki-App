import { StyleSheet, View } from "react-native";
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
  ] = useContext(FormDataContext);

  const [carData, setCarData] = useContext(InspecteCarContext);

  const [allSelected, setAllSelected] = useState(false);

  const [manufacturer, setManufacturer] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carVarient, setCarVarient] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carColor, setCarColor] = useState("");
  const [cplc, setCplc] = useState("");

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

  // useEffect(() => {
  //   fetchManufacturers();
  //   fetchCarModel();
  //   fetchCarVarient();
  //   fetchCarYears();
  //   fetchCarColors();
  // }, []);

  useEffect(() => {
    if (
      manufacturer !== "" &&
      carModel !== "" &&
      carYear !== "" &&
      carColor !== "" &&
      cplc !== ""
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [manufacturer, carModel, carYear, carColor, cplc]);

  // const fetchManufacturers = async () => {
  //   const config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: "/auth/get_carmanufacturer.php",
  //     headers: {},
  //   };

  //   try {
  //     const response = await axios.request(config);

  //     const ManufacturerNames = response.data;
  //     setManufacturersData(
  //       ManufacturerNames.map((object) => ({
  //         key: object.id,
  //         value: object.name,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching manufacturers:", error);
  //   }
  // };

  // const fetchCarModel = () => {
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: "/auth/get_carlistnew.php",
  //     headers: {},
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       const ModelNames = response.data;

  //       const transformedList = ModelNames.reduce((acc, Model) => {
  //         acc[Model.manufacturerID] = Model.carlistData.map((car) => ({
  //           key: car.carID,
  //           value: car.carName,
  //         }));
  //         return acc;
  //       }, {});
  //       setModelsData(transformedList);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const fetchCarVarient = () => {
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: "/auth/get_cartypenew.php",
  //     headers: {},
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       const VarientNames = response.data;

  //       const transformedList = VarientNames.reduce((acc, varient) => {
  //         acc[varient.carID] = varient.cartypeData.map((v) => ({
  //           key: v.typeID,
  //           value: v.TypeName,
  //         }));
  //         return acc;
  //       }, {});
  //       setVarientsData(transformedList);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const fetchCarYears = () => {
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: "/auth/get_caryears.php",
  //     headers: {},
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       const years = response.data;

  //       const transformedList = years.reduce((acc, year) => {
  //         acc[year.carID] = year.carYearData.map((y) => ({
  //           key: y.YearId,
  //           value: y.Year,
  //         }));
  //         return acc;
  //       }, {});
  //       setYearsData(transformedList);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const fetchCarColors = async () => {
  //   const config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: "/auth/get_color.php",
  //     headers: {},
  //   };

  //   try {
  //     const response = await axios.request(config);

  //     const CarColors = response.data;
  //     setColorsData(
  //       CarColors.map((object) => ({
  //         key: object.id,
  //         value: object.color,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching manufacturers:", error);
  //   }
  // };

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
      cplc: cplc,
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
