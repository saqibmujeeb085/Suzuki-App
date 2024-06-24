import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Context
const AuthContext = createContext();

// Provider
const AuthProvider = ({ children }) => {
  // Global
  const [userData, setUserData] = useState({
    token: "",
    user: "",
  });

  // Base URL
  axios.defaults.baseURL = "https://clients.echodigital.net/inspectionapp/apis";

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
      try {
        let data = await AsyncStorage.getItem("@auth");
        if (data) {
          let loginData = JSON.parse(data);
          setUserData({
            token: loginData?.token || "",
            user: loginData?.user || "",
          });
        }
      } catch (error) {
        console.error("Failed to load data from local storage:", error);
      }
    };
    localStorageData();
  }, [userData]);

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
