import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo
import axios from "axios";

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
      const keys = [
        "@formDataManufacturers",
        "@formDataModels",
        "@formDataVarients",
        "@formDataYears",
        "@formDataColors",
        "@formDataFuel",
        "@formDataTransmissions",
        "@formDataCapacity",
        "@formDataCities",
      ];
      const values = await AsyncStorage.multiGet(keys);

      setManufacturersData(JSON.parse(values[0][1]) || []);
      setModelsData(JSON.parse(values[1][1]) || []);
      setVarientsData(JSON.parse(values[2][1]) || []);
      setYearsData(JSON.parse(values[3][1]) || []);
      setColorsData(JSON.parse(values[4][1]) || []);
      setFuelsData(JSON.parse(values[5][1]) || []);
      setTransmissionsData(JSON.parse(values[6][1]) || []);
      setCapacitiesData(JSON.parse(values[7][1]) || []);
      setCitiesData(JSON.parse(values[8][1]) || []);
    } catch (error) {
      console.log("Failed to load data from AsyncStorage", error);
    }
  };

  // Function to save data to AsyncStorage
  const saveDataToLocalStorage = async () => {
    try {
      const data = [
        ["@formDataManufacturers", JSON.stringify(manufacturersData)],
        ["@formDataModels", JSON.stringify(modelsData)],
        ["@formDataVarients", JSON.stringify(varientsData)],
        ["@formDataYears", JSON.stringify(yearsData)],
        ["@formDataColors", JSON.stringify(colorsData)],
        ["@formDataFuel", JSON.stringify(fuelsData)],
        ["@formDataTransmissions", JSON.stringify(transmissionsData)],
        ["@formDataCapacity", JSON.stringify(capacitiesData)],
        ["@formDataCities", JSON.stringify(citiesData)],
      ];
      await AsyncStorage.multiSet(data);
    } catch (error) {
      console.log("Failed to save data to AsyncStorage", error);
    }
  };

  // Function to fetch data from server and update state
  const fetchDataFromServer = async () => {
    try {
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
      await saveDataToLocalStorage(); // Save fetched data after successful fetching
    } catch (error) {
      console.log("Error fetching data from the server:", error);
    }
  };

  //////////////////////////////////////////////////////////////////////

  // Fetch functions (server-side logic)
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
      const transformedData = ManufacturerNames.map((object) => ({
        key: object.id,
        value: object.name,
      }));
      setManufacturersData(transformedData);
      await AsyncStorage.setItem(
        "@formDataManufacturers",
        JSON.stringify(transformedData)
      );
    } catch (error) {
      console.log("Error fetching manufacturers:", error);
    }
  };

  const fetchCarModel = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_carlistnew.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const ModelNames = response.data;
      const transformedList = ModelNames.reduce((acc, Model) => {
        acc[Model.manufacturerID] = Model.carlistData.map((car) => ({
          key: car.carID,
          value: car.carName,
        }));
        return acc;
      }, {});
      setModelsData(transformedList);
      await AsyncStorage.setItem(
        "@formDataModels",
        JSON.stringify(transformedList)
      );
    } catch (error) {
      console.log("Error fetching car models:", error);
    }
  };

  const fetchCarVarient = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_cartypenew.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const VarientNames = response.data;
      const transformedList = VarientNames.reduce((acc, varient) => {
        acc[varient.carID] = varient.cartypeData.map((v) => ({
          key: v.typeID,
          value: v.TypeName,
        }));
        return acc;
      }, {});
      setVarientsData(transformedList);
      await AsyncStorage.setItem(
        "@formDataVarients",
        JSON.stringify(transformedList)
      );
    } catch (error) {
      console.log("Error fetching car variants:", error);
    }
  };

  const fetchCarYears = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_caryears.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const years = response.data;
      const transformedList = years.reduce((acc, year) => {
        acc[year.carID] = year.carYearData.map((y) => ({
          key: y.YearId,
          value: y.Year,
        }));
        return acc;
      }, {});
      setYearsData(transformedList);
      await AsyncStorage.setItem(
        "@formDataYears",
        JSON.stringify(transformedList)
      );
    } catch (error) {
      console.log("Error fetching car years:", error);
    }
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
      const transformedData = CarColors.map((object) => ({
        key: object.id,
        value: object.color,
      }));
      setColorsData(transformedData);
      await AsyncStorage.setItem(
        "@formDataColors",
        JSON.stringify(transformedData)
      );
    } catch (error) {
      console.log("Error fetching car colors:", error);
    }
  };

  const fetchFuelTypes = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_fuelType.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const FuelTypes = response.data;
      const transformedData = FuelTypes.map((object) => ({
        key: object.did,
        value: object.type,
      }));
      setFuelsData(transformedData);
      await AsyncStorage.setItem(
        "@formDataFuel",
        JSON.stringify(transformedData)
      );
    } catch (error) {
      console.log("Error fetching fuel types:", error);
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
      const TransmissionsTypes = response.data;
      const transformedData = TransmissionsTypes.map((object) => ({
        key: object.did,
        value: object.type,
      }));
      setTransmissionsData(transformedData);
      await AsyncStorage.setItem(
        "@formDataTransmissions",
        JSON.stringify(transformedData)
      );
    } catch (error) {
      console.log("Error fetching transmission types:", error);
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
      const EngineCapacity = response.data;
      const transformedData = EngineCapacity.map((object) => ({
        key: object.id,
        value: object.displacement,
      }));
      setCapacitiesData(transformedData);
      await AsyncStorage.setItem(
        "@formDataCapacity",
        JSON.stringify(transformedData)
      );
    } catch (error) {
      console.log("Error fetching engine capacities:", error);
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
      const RegistrationCity = response.data;
      const transformedData = RegistrationCity.map((object) => ({
        key: object.id,
        value: object.city,
      }));
      setCitiesData(transformedData);
      await AsyncStorage.setItem(
        "@formDataCities",
        JSON.stringify(transformedData)
      );
    } catch (error) {
      console.log("Error fetching registration cities:", error);
    }
  };

  ///////////////////////////////////////////////////////////////

  // Check network status and load data accordingly
  useEffect(() => {
    const handleNetworkChange = async (state) => {
      if (!state.isConnected) {
        await loadLocalStorageData();
      } else {
        await fetchDataFromServer();
      }
    };

    const checkNetworkAndLoadData = async () => {
      const state = await NetInfo.fetch();
      handleNetworkChange(state);
    };

    checkNetworkAndLoadData();

    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    // Cleanup function to save current state to AsyncStorage and unsubscribe
    return () => {
      saveDataToLocalStorage();
      unsubscribe();
    };
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
