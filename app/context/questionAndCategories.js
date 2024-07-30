import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
const QuesAndAnsContext = createContext();

// Provider
const QuesAndAnsProvider = ({ children }) => {
  // Global state
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Local Storage Initial Data
  useEffect(() => {
    const localStorageData = async () => {
        const category = await AsyncStorage.getItem("@Categories");
        const question = await AsyncStorage.getItem("@questions");
    

      const categoryData = JSON.parse(category);
      const questionData = JSON.parse(question);
      
      setManufacturersData(categoryData || categories);
      setModelsData(questionData || questions);
    };
    localStorageData();
  }, []);

  return (
    <QuesAndAnsContext.Provider
      value={[
        categories,
        setCategories,
        questions,
        setQuestions
      ]}
    >
      {children}
    </QuesAndAnsContext.Provider>
  );
};

export { QuesAndAnsContext, QuesAndAnsProvider };
