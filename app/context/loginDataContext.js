import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
const LoginDataContext = createContext();

// Provider
const LoginDataProvider = ({ children }) => {
  // Initial car data
  const initialLoginDealershipsData = {};

  const initialLoginDealershipUsersData = {};

  // Global
  const [loginDealershipData, setLoginDealershipData] = useState(
    initialLoginDealershipsData
  );
  const [loginDealershipUserData, setLoginDealershipUserData] = useState(
    initialLoginDealershipUsersData
  );

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      let dealershipdata = await AsyncStorage.getItem("@loginDealerships");
      let userdata = await AsyncStorage.getItem("@loginDealershipUsers");
      let LoginDealershipsData = JSON.parse(dealershipdata);
      let LoginDealershipUsersData = JSON.parse(userdata);
      setLoginDealershipData(
        LoginDealershipsData || initialLoginDealershipsData
      );
      setLoginDealershipUserData(
        LoginDealershipUsersData || initialLoginDealershipUsersData
      );
    };
    localStorageData();
  }, []);

  return (
    <LoginDataContext.Provider
      value={[
        loginDealershipData,
        setLoginDealershipData,
        loginDealershipUserData,
        setLoginDealershipUserData,
      ]}
    >
      {children}
    </LoginDataContext.Provider>
  );
};

export { LoginDataContext, LoginDataProvider };
