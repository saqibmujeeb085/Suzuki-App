import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
const InspecteCarContext = createContext();

//Provider
const InspecteCarProvider = ({ children }) => {
  // Initial car data
  const initialCarData = {
    dealershipId: "",
    duserId: "",
    customerID: "",
    registrationNo: "",
    chasisNo: "",
    EngineNo: "",
    inspectionDate: "",
    mfgId: "",
    carId: "",
    varientId: "",
    engineDisplacement: "",
    model: "",
    cplc: "",
    buyingCode: "",
    NoOfOwners: "",
    transmissionType: "",
    mileage: "",
    registrationCity: "",
    FuelType: "",
    provience: "",
    color: "",
    status: "draft",
  };

  //Global
  const [carData, setCarData] = useState(initialCarData);

  // Reset function
  const resetCarData = () => {
    setCarData(initialCarData);
  };

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      let data = await AsyncStorage.getItem("@InspectingCarData");
      let InspectingCarData = JSON.parse(data);
      setCarData(InspectingCarData || initialCarData);
    };
    localStorageData();
  }, []);

  return (
    <InspecteCarContext.Provider value={[carData, setCarData, resetCarData]}>
      {children}
    </InspecteCarContext.Provider>
  );
};

export { InspecteCarContext, InspecteCarProvider };
