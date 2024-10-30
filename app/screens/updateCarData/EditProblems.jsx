import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import InspectionHeader from "../../components/header/InspectionHeader";
import { colors } from "../../constants/colors";
import GradientButton from "../../components/buttons/GradientButton";
import { RadioGroup } from "react-native-radio-buttons-group";
import Checkbox from "expo-checkbox";
import { mainStyles } from "../../constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InspectionImagePicker from "../../components/imagePicker/InspectionImagePicker"; // Import the Image Picker component
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EditProblems = ({ navigation, route }) => {
  const { id, location } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);

  const [problems, setProblems] = useState({
    repaint: {
      checked: false,
      selectedId: null,
      selectedValue: null,
      image: null,
      imageName: null,
    },
    Dent: {
      checked: false,
      selectedId: null,
      selectedValue: null,
      image: null,
      imageName: null,
    },
    Scratch: {
      checked: false,
      selectedId: null,
      selectedValue: null,
      image: null,
      imageName: null,
    },
    PanelReplaced: {
      // Added PanelReplaced
      checked: false,
      selectedValue: null, // Automatically set this when checked
      image: null,
      imageName: null,
    },
  });

  const [carBodyProblems, setCarBodyProblems] = useState(null);

  useEffect(() => {
    getCarProblemsDataByTempID(id, location);
  }, [id, location]);

  const getCarProblemsDataByTempID = async (tempID, location) => {
    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");
      if (storedData !== null) {
        const carFormDataArray = JSON.parse(storedData);

        const carbodyques = carFormDataArray.find(
          (item) => item.tempID == tempID && item.problemLocation === location
        );

        if (carbodyques) {
          setCarBodyProblems(carbodyques);

          const updatedProblems = { ...problems };
          carbodyques.problems.forEach((problem) => {
            if (updatedProblems[problem.problemName]) {
              updatedProblems[problem.problemName].checked = true;
              updatedProblems[problem.problemName].selectedValue =
                problem.selectedValue;
              updatedProblems[problem.problemName].selectedId = points[
                problem.problemName
              ]?.find((p) => p.value === problem.selectedValue)?.id;

              if (problem.image) {
                updatedProblems[problem.problemName].image = problem.image.uri;
                updatedProblems[problem.problemName].imageName =
                  problem.image.name;
              }
            }
          });
          setProblems(updatedProblems);
        }
      }
    } catch (error) {
      console.error("Error retrieving car data:", error);
    }
  };

  const points = {
    repaint: [
      {
        id: "1",
        label: "Shower Paint",
        value: "Shower Paint",
        color: colors.purple,
      },
      {
        id: "2",
        label: "Polycate paint",
        value: "Polycate paint",
        color: colors.purple,
      },
    ],
    Dent: [
      {
        id: "3",
        label: "Minor Dent",
        value: "Minor Dent",
        color: colors.purple,
      },
      {
        id: "4",
        label: "Major Dent",
        value: "Major Dent",
        color: colors.purple,
      },
    ],
    Scratch: [
      {
        id: "5",
        label: "Minor Scratch",
        value: "Minor Scratch",
        color: colors.purple,
      },
      {
        id: "6",
        label: "Major Scratch",
        value: "Major Scratch",
        color: colors.purple,
      },
    ],
  };

  const handleProblemToggle = (problem) => {
    if (problems[problem]) {
      setProblems((prev) => {
        const updatedProblem = {
          ...prev[problem],
          checked: !prev[problem].checked,
          selectedId: prev[problem].checked ? null : prev[problem].selectedId,
          selectedValue:
            problem === "PanelReplaced" && !prev[problem].checked
              ? "Replaced Panel" // Automatically set value for PanelReplaced
              : prev[problem].checked
              ? null
              : prev[problem].selectedValue,
        };

        if (!updatedProblem.checked) {
          updatedProblem.selectedId = null;
          updatedProblem.selectedValue = null;
          updatedProblem.image = null;
          updatedProblem.imageName = null;
        }

        return {
          ...prev,
          [problem]: updatedProblem,
        };
      });
    }
  };

  const handleSubProblemSelect = (problem, selectedId) => {
    const selectedOption = points[problem].find(
      (radio) => radio.id === selectedId
    );
    const selectedValue = selectedOption ? selectedOption.value : null;

    setProblems((prev) => ({
      ...prev,
      [problem]: {
        ...prev[problem],
        selectedId: selectedId,
        selectedValue: selectedValue,
      },
    }));
  };

  const handleImageUriSelect = (problem, uri) => {
    if (problems[problem]) {
      setProblems((prev) => ({
        ...prev,
        [problem]: {
          ...prev[problem],
          image: uri,
        },
      }));
    }
  };

  const handleImageNameSelect = (problem, name) => {
    if (problems[problem]) {
      setProblems((prev) => ({
        ...prev,
        [problem]: {
          ...prev[problem],
          imageName: name,
        },
      }));
    }
  };

  // Function to check if all checked problems have valid data
  const isSaveDisabled = () => {
    return Object.keys(problems).some((key) => {
      const problem = problems[key];
      return problem.checked && (!problem.selectedValue || !problem.image);
    });
  };

  const handleSave = async () => {
    try {
      const storedData = await AsyncStorage.getItem("@carBodyQuestionsdata");
      if (storedData !== null) {
        let carFormDataArray = JSON.parse(storedData);

        const updatedData = carFormDataArray.map((item) => {
          if (item.tempID === id && item.problemLocation === location) {
            return {
              ...item,
              problems: Object.keys(problems)
                .filter(
                  (key) => problems[key].checked && problems[key].selectedValue
                )
                .map((key) => ({
                  problemName: key,
                  selectedValue: problems[key].selectedValue,
                  image: problems[key].image
                    ? {
                        uri: problems[key].image,
                        name: problems[key].imageName,
                        type: "image/jpeg",
                      }
                    : null,
                })),
            };
          }
          return item;
        });

        await AsyncStorage.setItem(
          "@carBodyQuestionsdata",
          JSON.stringify(updatedData)
        );

        console.log("Data updated successfully!");
        navigation.navigate("ViewReport", {
          id: `${id}`,
        });
      }
    } catch (error) {
      console.error("Error saving car data:", error);
    }
  };
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    console.log(imageUri);
    setModalVisible(true);
  };

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Edit Car Problems
      </InspectionHeader>
      <ScrollView style={{ marginBottom: 120, minHeight: 500 }}>
        <View
          style={{
            marginHorizontal: 20,
            padding: 20,
            backgroundColor: colors.whiteBg,
            borderRadius: 5,
            elevation: 2,
            marginBottom: 10,
          }}
        >
          <AppText
            fontSize={mainStyles.h1FontSize}
            fontFamily={mainStyles.appFontBold}
            textAlign={"center"}
          >
            {carBodyProblems?.problemLocation}
          </AppText>
        </View>
        <View style={styles.problemList}>
          {Object.keys(points).map((problem) => (
            <View key={problem}>
              <View style={styles.problemRow}>
                <Checkbox
                  onValueChange={() => handleProblemToggle(problem)}
                  color={problems[problem]?.checked ? colors.purple : undefined}
                  value={problems[problem]?.checked}
                  style={{ height: 25, width: 25 }}
                />
                <AppText fontSize={mainStyles.h2FontSize}>
                  {problem.charAt(0).toUpperCase() + problem.slice(1)}
                </AppText>
              </View>
              {problems[problem]?.checked && (
                <View style={styles.subProblemContainer}>
                  <RadioGroup
                    containerStyle={styles.radioGroup}
                    radioButtons={points[problem]}
                    onPress={(selectedId) =>
                      handleSubProblemSelect(problem, selectedId)
                    }
                    selectedId={problems[problem]?.selectedId}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {problems[problem].image != null && (
                      <TouchableOpacity
                        style={{
                          borderRadius: 5,
                          overflow: "hidden",
                          width: 60,
                          height: 60,
                          elevation: 1,
                          backgroundColor: colors.whiteBg,
                        }}
                        onPress={() => openImageModal(problems[problem]?.image)}
                      >
                        <Image
                          source={{
                            uri: problems[problem]?.image,
                          }}
                          style={{
                            justifyContent: "cover",
                            height: 60,
                            width: 60,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    <InspectionImagePicker
                      onImageSelected={(uri) =>
                        handleImageUriSelect(problem, uri)
                      }
                      onSelectedImageName={(name) =>
                        handleImageNameSelect(problem, name)
                      }
                      onRemoveImage={() => handleImageUriSelect(problem, null)}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Panel Replaced Section */}
          <View>
            <View style={styles.problemRow}>
              <Checkbox
                onValueChange={() => handleProblemToggle("PanelReplaced")}
                color={
                  problems.PanelReplaced?.checked ? colors.purple : undefined
                }
                value={problems.PanelReplaced?.checked}
                style={{ height: 25, width: 25 }}
              />
              <AppText fontSize={mainStyles.h2FontSize}>Panel Replaced</AppText>
            </View>
            {problems.PanelReplaced?.checked && (
              <View style={styles.subProblemContainer}>
                {/* Only image picker for Panel Replaced */}
                <InspectionImagePicker
                  onImageSelected={(uri) =>
                    handleImageUriSelect("PanelReplaced", uri)
                  }
                  onSelectedImageName={(name) =>
                    handleImageNameSelect("PanelReplaced", name)
                  }
                  onRemoveImage={() =>
                    handleImageUriSelect("PanelReplaced", null)
                  }
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.formButton}>
        <GradientButton onPress={handleSave} disabled={isSaveDisabled()}>
          Save
        </GradientButton>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close modal when back is pressed
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              position: "relative",
              height: "60%",
              width: "90%",
              borderRadius: 15,
              padding: 10,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.fontWhite}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Image
              source={{
                uri: selectedImage,
              }}
              style={{
                objectFit: "contain",
                flex: 1,
                width: "100%",
                borderRadius: 5,
                overflow: "hidden",
              }}
            />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
};

export default EditProblems;

const styles = StyleSheet.create({
  formButton: {
    position: "absolute",
    padding: 20,
    width: "100%",
    bottom: 0,
    backgroundColor: colors.ligtGreyBg,
  },
  problemList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 100,
    height: 30,
    width: 30,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  problemRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  subProblemContainer: {
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: colors.whiteBg,
    marginVertical: 10,
  },
  radioGroup: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});
