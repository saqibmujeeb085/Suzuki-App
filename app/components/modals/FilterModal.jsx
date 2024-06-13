import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AppText from "../text/Text";
import GradientButton from "../buttons/GradientButton";
import Dropdown from "../formFields/Dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FilterModal = ({ show = false, setShow = () => {}, onFilter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturer, setManufacturer] = useState("");
  const [carColors, setCarColors] = useState([]);
  const [carColor, setCarColor] = useState("");
  const [carYears, setCarYears] = useState([]);
  const [carYear, setCarYear] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [carModel, setCarModel] = useState("");

  const handleConfirmStartDate = (date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };
  const handleConfirmEndDate = (date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  const CarColorSelected = (selected) => {
    setCarColor(selected);
  };
  const ManufacturerSelected = (selected) => {
    setManufacturer(selected);
  };
  const CarModelSelected = (selected) => {
    setCarModel(selected);
  };
  const CarYearSelected = (selected) => {
    setCarYear(selected);
  };

  useEffect(() => {
    fetchManufacturers();
    fetchCarColors();

    const currentYear = new Date().getFullYear();
    const yearList = [];

    for (let year = currentYear, id = 1; year >= 1950; year--, id++) {
      yearList.push({
        key: id.toString(),
        value: year.toString(),
      });
    }

    setCarYears(yearList);
  }, []);

  useEffect(() => {
    if (manufacturer !== "") {
      fetchCarModel();
    }
  }, [manufacturer]);

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
      setManufacturers(
        ManufacturerNames.map((object) => ({
          key: object.id,
          value: object.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
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
      setCarColors(
        CarColors.map((object) => ({
          key: object.id,
          value: object.color,
        }))
      );
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const fetchCarModel = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_carlist.php?manufacturername=${manufacturer}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const ModelNames = response.data;

        if (Array.isArray(ModelNames)) {
          setCarModels(
            ModelNames.map((object) => ({
              key: object.Id,
              value: object.Car,
            }))
          );
        } else {
          console.error("Unexpected API response format:", ModelNames);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = () => {
    const filters = {
      startDate,
      endDate,
      manufacturer,
      carColor,
      carYear,
      carModel,
    };
    onFilter(filters);
    clearFilters();
    setShow(false);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setManufacturer("");
    setCarColor("");
    setCarYear("");
    setCarModel("");
  };

  return (
    <Modal transparent visible={show}>
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={14}
              color={"#1D1D1D"}
              onPress={() => setShow(!show)}
            />
          </View>

          <View style={styles.FiltersInputs}>
            <View style={styles.Content}>
              <AppText fontSize={12}>Filters</AppText>
              <AppText fontSize={10}>Add filters for more accuracy</AppText>
            </View>
            <View style={styles.Inputs}>
              <Dropdown
                DropItems="Manufacturer"
                Data={manufacturers}
                save={"value"}
                selectedItem={ManufacturerSelected}
              />
              {manufacturer && (
                <Dropdown
                  DropItems="Model"
                  Data={carModels}
                  save={"value"}
                  selectedItem={CarModelSelected}
                />
              )}
              <Dropdown
                DropItems="Manufacturing Year"
                Data={carYears}
                save={"value"}
                selectedItem={CarYearSelected}
                Search={true}
              />
              <Dropdown
                DropItems="Color"
                Data={carColors}
                save={"value"}
                selectedItem={CarColorSelected}
              />
              <View style={styles.DatePickers}>
                <View style={styles.datePickerContainer}>
                  <AppText fontSize={10} marginBottom={5}>
                    Start Date
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setStartDatePickerVisibility(true)}
                  >
                    <AppText
                      borderColor={"#CCCCCC"}
                      borderWidth={1}
                      borderRadius={5}
                      padding={10}
                      textAlign={"center"}
                    >
                      {startDate
                        ? startDate.toLocaleDateString()
                        : "--/--/----"}
                    </AppText>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmStartDate}
                    onCancel={() => setStartDatePickerVisibility(false)}
                  />
                </View>
                <View style={styles.datePickerContainer}>
                  <AppText fontSize={10} marginBottom={5}>
                    End Date
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setEndDatePickerVisibility(true)}
                  >
                    <AppText
                      borderColor={"#CCCCCC"}
                      borderWidth={1}
                      borderRadius={5}
                      padding={10}
                      textAlign={"center"}
                    >
                      {endDate ? endDate.toLocaleDateString() : "--/--/----"}
                    </AppText>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmEndDate}
                    onCancel={() => setEndDatePickerVisibility(false)}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <GradientButton size={10} onPress={handleSearch}>
              Search
            </GradientButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(FilterModal);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000060",
  },
  modalBox: {
    width: 300,
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 35,
    gap: 15,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 40,
    height: 25,
    width: 25,
    backgroundColor: "#BBBBBB",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtons: {
    marginTop: 15,
    gap: 15,
    height: 50,
  },
  Content: {
    gap: 5,
    alignItems: "center",
  },
  Inputs: {
    marginTop: 10,
    gap: 10,
  },
  DatePickers: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  datePickerContainer: {
    flex: 1,
  },
  datePickerButton: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
  },
});
