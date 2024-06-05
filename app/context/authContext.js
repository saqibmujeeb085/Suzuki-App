import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Context
const AuthContext = createContext();

//Provider
const AuthProvider = ({ children }) => {
  //Global
  const [userData, setUserData] = useState({
    token: "",
    user: "",
  });

  //Base URL
  axios.defaults.baseURL = "https://clients.echodigital.net/inspectionapp/apis";

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      setUserData({
        ...userData,
        token: data?.token,
        user: data?.user,
      });
    };
    localStorageData();
  }, []);
  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
