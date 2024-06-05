import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
const InspecteCarContext = createContext();

//Provider
const InspecteCarProvider = ({ children }) => {
  //Global
  const [carData, setCarData] = useState({
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
    color: "",
    carPic: "",
    status: "draft",
  });

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      let data = await AsyncStorage.getItem("@InspectingCarData");
      let InspectingCarData = JSON.parse(data);
      setCarData({
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
        color: "",
        carPic: "",
        status: "draft",
      });
    };
    localStorageData();
  }, []);
  return (
    <InspecteCarContext.Provider value={[carData, setCarData]}>
      {children}
    </InspecteCarContext.Provider>
  );
};

export { InspecteCarContext, InspecteCarProvider };
