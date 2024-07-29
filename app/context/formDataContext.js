import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
const FormDataContext = createContext();

// Provider
const FormDataProvider = ({ children }) => {
  // Initial car data
  const initialManufacturerData = {};
  const initialModelsData = {};
  const initialVarientsData = {};
  const initialYearsData = {};
  const initialColorsData = {};
  const initialFuelData = {};
  const initialTransmissionsData = {};
  const initialCapacityData = {};
  const initialCitiesData = {};

  // Global
  const [manufacturersData, setManufacturersData] = useState(
    initialManufacturerData
  );
  const [modelsData, setModelsData] = useState(initialModelsData);
  const [varientsData, setVarientsData] = useState(initialVarientsData);
  const [yearsData, setYearsData] = useState(initialYearsData);
  const [colorsData, setColorsData] = useState(initialColorsData);
  const [fuelData, setFuelData] = useState(initialFuelData);
  const [transmissionData, setTransmissionData] = useState(
    initialTransmissionsData
  );
  const [capacityData, setCapacityData] = useState(initialCapacityData);
  const [citiesData, setCitiesData] = useState(initialCitiesData);

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      let manufacturer = await AsyncStorage.getItem("@formDataManufacturers");
      let models = await AsyncStorage.getItem("@formDatacarModels");
      let varients = await AsyncStorage.getItem("@formDatacarVarients");
      let years = await AsyncStorage.getItem("@formDatacarYears");
      let colors = await AsyncStorage.getItem("@formDatacarColors");
      let fuel = await AsyncStorage.getItem("@formDatafuelTypes");
      let transmissions = await AsyncStorage.getItem(
        "@formDatatransmissionsTypes"
      );
      let capacity = await AsyncStorage.getItem("@formDataengineCapacities");
      let cities = await AsyncStorage.getItem("@formDataregistrationCities");

      let manufacturerData = JSON.parse(manufacturer);
      let modelsData = JSON.parse(models);
      let varientsData = JSON.parse(varients);
      let yearsData = JSON.parse(years);
      let colorsData = JSON.parse(colors);
      let fuelData = JSON.parse(fuel);
      let transmissionsData = JSON.parse(transmissions);
      let capacityData = JSON.parse(capacity);
      let citiesData = JSON.parse(cities);

      setManufacturersData(manufacturerData || initialManufacturerData);
      setModelsData(modelsData || initialModelsData);
      setVarientsData(varientsData || initialVarientsData);
      setYearsData(yearsData || initialYearsData);
      setColorsData(colorsData || initialColorsData);
      setFuelData(fuelData || initialFuelData);
      setTransmissionData(transmissionsData || initialTransmissionsData);
      setCapacityData(capacityData || initialCapacityData);
      setCitiesData(citiesData || initialCitiesData);
    };
    localStorageData();
  }, []);

  return (
    <FormDataContext.Provider
      value={[
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
        fuelData,
        setFuelData,
        transmissionData,
        setTransmissionData,
        capacityData,
        setCapacityData,
        citiesData,
        setCitiesData,
      ]}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export { FormDataContext, FormDataProvider };
