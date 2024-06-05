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

const CarDetails = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);
  const [carData, setCarData] = useContext(InspecteCarContext);

  console.log(carData);

  const [manufacturers, setManufacturers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carVarients, setCarVarients] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [carColors, setCarColors] = useState([]);

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

  useEffect(() => {
    fetchManufacturers();

    fetchCarColors();

    const currentYear = new Date().getFullYear();
    const yearList = [];

    for (let year = currentYear, id = 1; year >= 1950; year--, id++) {
      yearList.push({
        key: id.toString(),
        value: year.toString(),
      });
    }

    return setCarYears(yearList);
  }, []);

  useEffect(() => {
    if (manufacturer >= 1) {
      fetchCarModel();
    }
  }, [manufacturer]);

  useEffect(() => {
    if (carModel >= 1) {
      fetchCarVarient();
    }
  }, [carModel]);

  const fetchManufacturers = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_carmanufacturer.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);

      const ManufacturerNames = response.data;
      setManufacturers(
        ManufacturerNames.map((object) => ({
          key: object.id,
          value: object.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const fetchCarModel = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_carlist.php?manufacturerID=${manufacturer}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const ModelNames = response.data;

        if (Array.isArray(ModelNames)) {
          setCarModels(
            ModelNames.map((object) => ({
              key: object.Id,
              value: object.Car,
            }))
          );
        } else {
          console.error("Unexpected API response format:", ModelNames);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCarVarient = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_cartype.php?carID=${carModel}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const VarientNames = response.data;

        if (Array.isArray(VarientNames)) {
          setCarVarients(
            VarientNames.map((object) => ({
              key: object.id,
              value: object.CarType,
            }))
          );
        } else {
          console.error("Unexpected API response format:", VarientNames);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCarColors = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_color.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);

      const CarColors = response.data;
      setCarColors(
        CarColors.map((object) => ({
          key: object.id,
          value: object.color,
        }))
      );
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const addCarDetails = () => {
    if (
      manufacturer !== "" &&
      carModel !== "" &&
      carYear !== "" &&
      carColor !== "" &&
      cplc !== ""
    ) {
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
    } else {
      alert("Please Select and Fill All The Fields");
    }
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Car Details
      </InspectionHeader>
      <View style={styles.InspectionformContainer}>
        <Dropdown
          DropItems="Manufacturer"
          Data={manufacturers}
          save={"key"}
          selectedItem={ManufacturerSelected}
        />

        <Dropdown
          DropItems="Model"
          Data={carModels}
          save={"key"}
          selectedItem={CarModelSelected}
        />

        <Dropdown
          DropItems="Car Varient"
          Data={carVarients}
          save={"key"}
          selectedItem={CarVarientSelected}
        />

        <Dropdown
          DropItems="Manufacturer Year"
          Data={carYears}
          save={"value"}
          selectedItem={CarYearSelected}
          Search={true}
        />

        <Dropdown
          DropItems="Color"
          Data={carColors}
          save={"value"}
          selectedItem={CarColorSelected}
        />
        <Dropdown
          DropItems="CPLC"
          Data={cplcOptions}
          save={"value"}
          selectedItem={CplcSelected}
        />
        <View style={styles.formButton}>
          <GradientButton onPress={addCarDetails}>Next</GradientButton>
        </View>
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
    marginTop: 10,
  },
});
