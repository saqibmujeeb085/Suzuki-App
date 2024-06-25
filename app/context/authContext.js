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

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadLocalStorageData = async () => {
      try {
        let data = await AsyncStorage.getItem("@auth");
        if (data) {
          let loginData = JSON.parse(data);
          setUserData({
            token: loginData?.token || "",
            user: loginData?.user || "",
          });
          console.log("Data loaded from AsyncStorage:", loginData);
        } else {
          console.log("No data found in AsyncStorage for @auth");
        }
      } catch (error) {
        console.error("Failed to load data from local storage:", error);
      }
    };
    loadLocalStorageData();
  }, []);

  // Save data to AsyncStorage when userData changes
  useEffect(() => {
    const saveToLocalStorage = async () => {
      try {
        await AsyncStorage.setItem("@auth", JSON.stringify(userData));
        console.log("Data saved to AsyncStorage:", userData);
      } catch (error) {
        console.error("Failed to save data to local storage:", error);
      }
    };
    saveToLocalStorage();
  }, [userData]);

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
