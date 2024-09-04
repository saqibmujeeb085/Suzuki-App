// import React, { createContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Context
// const FormDataContext = createContext();

// // Provider
// const FormDataProvider = ({ children }) => {
//   // Global state
//   const [manufacturersData, setManufacturersData] = useState([]);
//   const [modelsData, setModelsData] = useState([]);
//   const [varientsData, setVarientsData] = useState([]);
//   const [yearsData, setYearsData] = useState([]);
//   const [colorsData, setColorsData] = useState([]);
//   const [fuelsData, setFuelsData] = useState([]);
//   const [transmissionsData, setTransmissionsData] = useState([]);
//   const [capacitiesData, setCapacitiesData] = useState([]);
//   const [citiesData, setCitiesData] = useState([]);

//   // Local Storage Initial Data
//   useEffect(() => {
//     const localStorageData = async () => {
//       const manufacturer = await AsyncStorage.getItem("@formDataManufacturers");
//       const models = await AsyncStorage.getItem("@formDataModels");
//       const varients = await AsyncStorage.getItem("@formDataVarients");
//       const years = await AsyncStorage.getItem("@formDataYears");
//       const colors = await AsyncStorage.getItem("@formDataColors");
//       const fuel = await AsyncStorage.getItem("@formDataFuel");
//       const transmissions = await AsyncStorage.getItem(
//         "@formDataTransmissions"
//       );
//       const capacity = await AsyncStorage.getItem("@formDataCapacity");
//       const cities = await AsyncStorage.getItem("@formDataCities");

//       const manufacturerData = JSON.parse(manufacturer);
//       const modelData = JSON.parse(models);
//       const varientData = JSON.parse(varients);
//       const yearData = JSON.parse(years);
//       const colorData = JSON.parse(colors);
//       const fuelData = JSON.parse(fuel);
//       const transmissionData = JSON.parse(transmissions);
//       const capacityData = JSON.parse(capacity);
//       const cityData = JSON.parse(cities);

//       setManufacturersData(manufacturerData || manufacturersData);
//       setModelsData(modelData || modelsData);
//       setVarientsData(varientData || varientsData);
//       setYearsData(yearData || yearsData);
//       setColorsData(colorData || colorsData);
//       setFuelsData(fuelData || fuelsData);
//       setTransmissionsData(transmissionData || transmissionsData);
//       setCapacitiesData(capacityData || capacitiesData);
//       setCitiesData(cityData || citiesData);
//     };
//     localStorageData();
//   }, []);

//   return (
//     <FormDataContext.Provider
//       value={[
//         manufacturersData,
//         setManufacturersData,
//         modelsData,
//         setModelsData,
//         varientsData,
//         setVarientsData,
//         yearsData,
//         setYearsData,
//         colorsData,
//         setColorsData,
//         fuelsData,
//         setFuelsData,
//         transmissionsData,
//         setTransmissionsData,
//         capacitiesData,
//         setCapacitiesData,
//         citiesData,
//         setCitiesData,
//       ]}
//     >
//       {children}
//     </FormDataContext.Provider>
//   );
// };

// export { FormDataContext, FormDataProvider };

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo

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

  // Function to load data from AsyncStorage
  const loadLocalStorageData = async () => {
    try {
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

      setManufacturersData(JSON.parse(manufacturer) || []);
      setModelsData(JSON.parse(models) || []);
      setVarientsData(JSON.parse(varients) || []);
      setYearsData(JSON.parse(years) || []);
      setColorsData(JSON.parse(colors) || []);
      setFuelsData(JSON.parse(fuel) || []);
      setTransmissionsData(JSON.parse(transmissions) || []);
      setCapacitiesData(JSON.parse(capacity) || []);
      setCitiesData(JSON.parse(cities) || []);
    } catch (error) {
      console.error("Failed to load data from AsyncStorage", error);
    }
  };

  // Function to save data to AsyncStorage
  const saveDataToLocalStorage = async () => {
    try {
      await AsyncStorage.setItem(
        "@formDataManufacturers",
        JSON.stringify(manufacturersData)
      );
      await AsyncStorage.setItem("@formDataModels", JSON.stringify(modelsData));
      await AsyncStorage.setItem(
        "@formDataVarients",
        JSON.stringify(varientsData)
      );
      await AsyncStorage.setItem("@formDataYears", JSON.stringify(yearsData));
      await AsyncStorage.setItem("@formDataColors", JSON.stringify(colorsData));
      await AsyncStorage.setItem("@formDataFuel", JSON.stringify(fuelsData));
      await AsyncStorage.setItem(
        "@formDataTransmissions",
        JSON.stringify(transmissionsData)
      );
      await AsyncStorage.setItem(
        "@formDataCapacity",
        JSON.stringify(capacitiesData)
      );
      await AsyncStorage.setItem("@formDataCities", JSON.stringify(citiesData));
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
    }
  };

  // Function to fetch data from server and update state
  const fetchDataFromServer = async () => {
    // Implement your server fetching logic here
    try {
      // Assuming fetchManufacturers, fetchModels, etc., are functions that fetch from the server
      await Promise.all([
        fetchManufacturers(),
        fetchCarModel(),
        fetchCarVarient(),
        fetchCarYears(),
        fetchCarColors(),
        fetchFuelTypes(),
        fetchTransmissionsTypes(),
        fetchEngineCapacity(),
        fetchRegistrationCity(),
      ]);
    } catch (error) {
      console.error("Error fetching data from the server:", error);
    }
  };

  // Check network status and load data accordingly
  useEffect(() => {
    const checkNetworkAndLoadData = async () => {
      const state = await NetInfo.fetch(); // Fetch the network status
      if (!state.isConnected) {
        // If not connected to the internet, load data from AsyncStorage
        await loadLocalStorageData();
      } else {
        // Fetch data from the server and save it to AsyncStorage
        await fetchDataFromServer();
        await saveDataToLocalStorage();
      }
    };

    checkNetworkAndLoadData();

    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        loadLocalStorageData();
      } else {
        fetchDataFromServer().then(saveDataToLocalStorage);
      }
    });

    // Cleanup function to save current state to AsyncStorage and unsubscribe
    return () => {
      saveDataToLocalStorage(); // Save data to AsyncStorage
      unsubscribe(); // Unsubscribe from network status changes
    };
  }, [
    manufacturersData,
    modelsData,
    varientsData,
    yearsData,
    colorsData,
    fuelsData,
    transmissionsData,
    capacitiesData,
    citiesData,
  ]);

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
