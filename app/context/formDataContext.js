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
  const [provinceData, setProvinceData] = useState([]);
  const [chasisData, setChasisData] = useState([]);
  const [engineData, setEngineData] = useState([]);

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
        "@formDataProvince",
        "@formDataChasis",
        "@formDataEngine",
      ];

      // Fetch all AsyncStorage values for the given keys
      const values = await AsyncStorage.multiGet(keys);

      // Check if any value exists for each key and set state, else set an empty array
      const dataMapping = {
        setManufacturersData: JSON.parse(values[0][1]) || [],
        setModelsData: JSON.parse(values[1][1]) || [],
        setVarientsData: JSON.parse(values[2][1]) || [],
        setYearsData: JSON.parse(values[3][1]) || [],
        setColorsData: JSON.parse(values[4][1]) || [],
        setFuelsData: JSON.parse(values[5][1]) || [],
        setTransmissionsData: JSON.parse(values[6][1]) || [],
        setCapacitiesData: JSON.parse(values[7][1]) || [],
        setCitiesData: JSON.parse(values[8][1]) || [],
        setProvinceData: JSON.parse(values[9][1]) || [],
        setChasisData: JSON.parse(values[10][1]) || [],
        setEngineData: JSON.parse(values[11][1]) || [],
      };

      // Map over the object and apply the state setters
      Object.entries(dataMapping).forEach(([setState, value]) => {
        if (value.length > 0) {
          window[setState](value);
        }
      });
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
        ["@formDataProvince", JSON.stringify(provinceData)],
        ["@formDataChasis", JSON.stringify(chasisData)],
        ["@formDataEngine", JSON.stringify(engineData)],
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
        fetchRegistrationCity(),
        fetchCarCapacity(),
        fetchProvince(),
        fetchChasis(),
        fetchEngine(),
      ]);
      await saveDataToLocalStorage(); // Save fetched data after successful fetching
    } catch (error) {
      console.log("Error fetching data from the server:", error);
    }
  };

  //////////////////////////////////////////////////////////////////////

  // Fetch functions (server-side logic)
  const fetchProvince = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_province.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const ProvinceData = response.data;

      setProvinceData(ProvinceData);
      await AsyncStorage.setItem(
        "@formDataProvince",
        JSON.stringify(ProvinceData)
      );
    } catch (error) {
      console.log("Error fetching Province:", error);
    }
  };
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

  const fetchChasis = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_chasisNo.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const chasisNo = response.data;
      const transformedList = chasisNo.reduce((acc, chasis) => {
        acc[chasis.carID] = chasis.carChasisNo.map((c) => ({
          key: c.chasisID,
          value: c.chasisNo,
        }));
        return acc;
      }, {});

      // Set the transformed data in the component state
      setChasisData(transformedList);

      // Store the transformed data in AsyncStorage
      await AsyncStorage.setItem(
        "@formDataChasis",
        JSON.stringify(transformedList)
      );
    } catch (error) {
      console.log("Error fetching car Chasis No:", error);
    }
  };

  const fetchEngine = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_engineNo.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const engineNo = response.data;
      const transformedList = engineNo.reduce((acc, engine) => {
        acc[engine.carID] = engine.carEngineNo.map((c) => ({
          key: c.engineID,
          value: c.engineNo,
        }));
        return acc;
      }, {});

      // Set the transformed data in the component state
      setEngineData(transformedList);

      // Store the transformed data in AsyncStorage
      await AsyncStorage.setItem(
        "@formDataEngine",
        JSON.stringify(transformedList)
      );
    } catch (error) {
      console.log("Error fetching car Chasis No:", error);
    }
  };

  const fetchCarCapacity = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_carcapacity.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const capacities = response.data;
      const transformedList = capacities.reduce((acc, capacity) => {
        acc[capacity.carID] = capacity.cartypeData.map((c) => ({
          key: c.capacityID,
          value: c.engineCapacity,
        }));
        return acc;
      }, {});

      // Set the transformed data in the component state
      setCapacitiesData(transformedList);

      // Store the transformed data in AsyncStorage
      await AsyncStorage.setItem(
        "@formDataCapacity",
        JSON.stringify(transformedList)
      );
    } catch (error) {
      console.log("Error fetching car capacities:", error);
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

  // const fetchEngineCapacity = async () => {
  //   const config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: "/auth/get_engdis.php",
  //     headers: {},
  //   };

  //   try {
  //     const response = await axios.request(config);
  //     const EngineCapacity = response.data;
  //     const transformedData = EngineCapacity.map((object) => ({
  //       key: object.id,
  //       value: object.displacement,
  //     }));
  //     setCapacitiesData(transformedData);
  //     await AsyncStorage.setItem(
  //       "@formDataCapacity",
  //       JSON.stringify(transformedData)
  //     );
  //   } catch (error) {
  //     console.log("Error fetching engine capacities:", error);
  //   }
  // };

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

  useEffect(() => {
    const checkNetworkAndLoadData = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        await fetchDataFromServer();
      } else {
        loadLocalStorageData(); // Ensure this is called immediately if offline
      }
    };

    checkNetworkAndLoadData();

    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        fetchDataFromServer();
      } else {
        loadLocalStorageData();
      }
    });

    return () => {
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
        provinceData,
        setProvinceData,
        chasisData,
        setChasisData,
        engineData,
        setEngineData,
      ]}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export { FormDataContext, FormDataProvider };
