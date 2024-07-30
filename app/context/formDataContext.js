import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
const FormDataContext = createContext();

// Provider
const FormDataProvider = ({ children }) => {
  // Global state
  const [manufacturersData, setManufacturersData] = useState([]);
  const [modelsData, setModelsData] = useState([]);
  const [varientsData, setVarientsData] = useState([]);
  const [yearsData, setYearsData] = useState([]);
  const [colorsData, setColorsData] = useState([]);
  const [fuelsData, setFuelsData] = useState([]);
  const [transmissionsData, setTransmissionsData] = useState([]);
  const [capacitiesData, setCapacitiesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      const manufacturer = await AsyncStorage.getItem("@formDataManufacturers");
      const models = await AsyncStorage.getItem("@formDataModels");
      const varients = await AsyncStorage.getItem("@formDataVarients");
      const years = await AsyncStorage.getItem("@formDataYears");
      const colors = await AsyncStorage.getItem("@formDataColors");
      const fuel = await AsyncStorage.getItem("@formDataFuel");
      const transmissions = await AsyncStorage.getItem(
        "@formDataTransmissions"
      );
      const capacity = await AsyncStorage.getItem("@formDataCapacity");
      const cities = await AsyncStorage.getItem("@formDataCities");

      const manufacturerData = JSON.parse(manufacturer);
      const modelData = JSON.parse(models);
      const varientData = JSON.parse(varients);
      const yearData = JSON.parse(years);
      const colorData = JSON.parse(colors);
      const fuelData = JSON.parse(fuel);
      const transmissionData = JSON.parse(transmissions);
      const capacityData = JSON.parse(capacity);
      const cityData = JSON.parse(cities);

      setManufacturersData(manufacturerData || manufacturersData);
      setModelsData(modelData || modelsData);
      setVarientsData(varientData || varientsData);
      setYearsData(yearData || yearsData);
      setColorsData(colorData || colorsData);
      setFuelsData(fuelData || fuelsData);
      setTransmissionsData(transmissionData || transmissionsData);
      setCapacitiesData(capacityData || capacitiesData);
      setCitiesData(cityData || citiesData);
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
        fuelsData,
        setFuelsData,
        transmissionsData,
        setTransmissionsData,
        capacitiesData,
        setCapacitiesData,
        citiesData,
        setCitiesData,
      ]}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export { FormDataContext, FormDataProvider };
