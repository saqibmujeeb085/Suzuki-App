import {
  StyleSheet,
  View,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import AppScreen from "../../components/screen/Screen";
import AppText from "../../components/text/Text";
import { mainStyles } from "../../constants/style";
import InspectionHeader from "../../components/header/InspectionHeader";
import { colors } from "../../constants/colors";
import CarInfoSkeletonPreloader from "../../components/skeletonLoader/CarInfoSkeletonPreloader";
import CarImagesCarousel from "../../components/carousel/CarImagesCarousel";
import { AuthContext } from "../../context/authContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import CarBodyView from "../../components/carBody/CarBodyView";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as IntentLauncher from "expo-intent-launcher";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import * as StorageAccessFramework from "expo-file-system";

const SingleCarInfo = ({ route, navigation }) => {
  const { id, rating } = route.params || {};
  const [userData, setUserData] = useContext(AuthContext);

  const [carInfo, setCarInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [bodyOpen, setBodyOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonOpen, setButtonOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const heightAnimOpacity = useRef(new Animated.Value(0)).current;
  const [zipUri, setZipUri] = useState(null);

  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // Request notification permissions
    requestPermissionsAsync();

    // Listener for notification actions
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { fileUri } = response.notification.request.content.data;
        if (fileUri) {
          // Open the downloaded file using Linking
          Linking.openURL(fileUri).catch((err) =>
            console.error("An error occurred while opening the file", err)
          );
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Function to request notification permissions
  const requestPermissionsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Notification permissions are required to notify you.");
    }
  };

  // Function to request storage permission for Android using StorageAccessFramework
  const requestFolderPermission = async () => {
    try {
      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert("You need to grant access to a folder to save the file.");
        return null;
      }
      return permissions.directoryUri;
    } catch (error) {
      console.error("Error requesting folder permissions:", error);
      return null;
    }
  };

  // Function to download ZIP file and save it to the Downloads folder using StorageAccessFramework
  const downloadZip = async (id) => {
    const downloadUri = `https://clients.echodigital.net/inspectionapp/apis/auth/get_document.php?id=${id}`; // Replace with your API endpoint
    const fileName = `Attachments_${id}.zip`; // File name

    try {
      // Request access to the Downloads folder or another user-specified folder
      const folderUri = await requestFolderPermission();
      if (!folderUri) return;

      // Download the ZIP file to a temporary location
      const { uri, status } = await FileSystem.downloadAsync(
        downloadUri,
        FileSystem.cacheDirectory + fileName
      );

      if (status !== 200) {
        console.error("Failed to download file");
        return;
      }

      // Read the contents of the downloaded file
      const fileContents = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save the file to the selected folder using StorageAccessFramework
      const fileUri = await StorageAccessFramework.createFileAsync(
        folderUri,
        fileName,
        "application/zip"
      );
      await FileSystem.writeAsStringAsync(fileUri, fileContents, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("File saved successfully to:", fileUri);

      // Trigger notification with "View" action
      triggerNotification(
        `Document Downloaded`,
        `File is saved to ${fileUri}`,
        fileUri
      );
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  // Function to trigger a notification with a "View" action
  const triggerNotification = async (title, body, fileUri) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { fileUri }, // Pass the fileUri so it can be accessed on notification tap
        categoryIdentifier: "view-zip", // Category for actionable button
      },
      trigger: null, // Immediately show the notification
    });
  };

  // Register a notification category with a "View ZIP" action
  useEffect(() => {
    Notifications.setNotificationCategoryAsync("view-zip", [
      {
        identifier: "view-zip-button",
        buttonTitle: "View ZIP",
        options: { opensAppToForeground: true }, // Bring the app to the foreground when the button is pressed
      },
    ]);
  }, []);
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Animate height and opacity when buttonOpen changes
  useEffect(() => {
    if (buttonOpen) {
      // Animate to open (expand height and fade in)
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 180, // Total height based on number of items
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false, // For height animations, native driver must be false
        }),
        Animated.timing(heightAnimOpacity, {
          toValue: 1, // Total height based on number of items
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: false, // For height animations, native driver must be false
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate to close (collapse height and fade out)
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(heightAnimOpacity, {
          toValue: 0,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: false, // For height animations, native driver must be false
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [buttonOpen]);

  useEffect(() => {
    if (!id) {
      setError(new Error("No ID provided"));
      setLoading(false);
      return;
    }

    fetchCarData();
  }, [id]);

  const fetchCarData = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/get_carinspectionsnew.php?id=${id}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      setCarInfo(response.data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    setLoading(false);
  };

  if (loading) {
    return <CarInfoSkeletonPreloader />;
  }

  if (error) {
    return (
      <View>
        <AppText>Error: {error.message}</AppText>
      </View>
    );
  }

  const getColorByRank = (rank) => {
    if (rank <= 1.9) return colors.red;
    if (rank <= 2.9) return colors.yellow;
    if (rank <= 3.9) return colors.blue;
    return colors.green;
  };

  const toggleExpanded = (key) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [key]: !prevState[key], // Toggle the expanded state for the specific section
    }));
  };
  const saleToCustomer = () => {
    setButtonOpen(!buttonOpen);
    navigation.navigate("CustomerForm", { carId: `${id}` });
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    console.log(imageUri);
    setModalVisible(true);
  };

  let questionNumber = 1;

  return (
    <AppScreen>
      <InspectionHeader onPress={() => navigation.goBack()}>
        Car Details
      </InspectionHeader>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.carInfo}>
          <View>
            <AppText
              fontSize={mainStyles.h1FontSize}
              fontFamily={mainStyles.appFontBold}
              marginBottom={5}
            >
              {carInfo?.manufacturer_name} {carInfo?.carName} {carInfo?.model}
            </AppText>
            <AppText fontSize={mainStyles.h3FontSize} color={colors.fontGrey}>
              {userData?.user?.dname}
            </AppText>
          </View>
          <View style={styles.inspectionRating}>
            <AnimatedCircularProgress
              size={60}
              width={8}
              fill={rating * 20} // This should be a number
              tintColor={getColorByRank(rating)}
              backgroundColor={colors.whiteBg} // Call the function with rank
              duration={1000}
            >
              {() => (
                <AppText fontSize={mainStyles.RatingFont}>{rating}/5</AppText>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View style={styles.ImageContainer}>
          <CarImagesCarousel images={carInfo?.images} />
        </View>

        <View style={styles.completeInfo}>
          <AppText
            fontFamily={mainStyles.appFontBold}
            fontSize={mainStyles.h2FontSize}
            marginBottom={10}
          >
            Car Summary
          </AppText>
          <View style={{ gap: 0 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialIcons
                name="access-time"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Inspection Date
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.inspection_date}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="circle-multiple-outline"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Car Varient
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.varientId}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="steering"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Transmission Type
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.transmission_type}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialIcons
                name="speed"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Mileage
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.mileage}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <Ionicons
                name="color-fill-outline"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />

              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Color
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.color}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="engine-outline"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Engine Displacement
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.engine_displacement}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="fuel"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Fuel Type
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.fuel_type}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <FontAwesome6
                name="wpforms"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                CPLC
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.cplc}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <Octicons
                name="number"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Registration No
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.registration_no}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <FontAwesome6
                name="car-rear"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Chasis No
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.chasis_no}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="numeric-9-circle-outline"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Engine No
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.engine_no}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.fontGrey,
                borderBottomWidth: 0.5,
                flex: 1,
              }}
            >
              <FontAwesome5
                name="people-arrows"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                No Of Owners
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.no_of_owners}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                paddingVertical: 10,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="city-variant-outline"
                size={24}
                style={{
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                color={colors.fontGrey}
              />
              <AppText
                color={colors.fontGrey}
                numberOfLines={1}
                ellipsizeMode={"tail"}
                width={140}
                flex={1}
              >
                Registration City
              </AppText>
              <Ionicons
                name="remove-outline"
                size={15}
                color={colors.fontBlack}
              />
              <AppText>{carInfo?.registration_city}</AppText>
            </View>
          </View>
        </View>
        <View style={styles.carQuestionAccrodians}>
          <TouchableOpacity
            style={styles.accordianTap}
            onPress={() => setBodyOpen(!bodyOpen)} // Toggle the expanded state for this key
            activeOpacity={0.8}
          >
            <View style={styles.accordionHeader}>
              <AppText>Car Body</AppText>
              <Feather
                name={bodyOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {bodyOpen && (
            <View>
              <CarBodyView carBodyData={carInfo.grouped_problems} />
              <View style={{ gap: 10, marginTop: 20 }}>
                <AppText fontFamily={mainStyles.appFontBold}>
                  Full Description
                </AppText>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <AppText>P: Paint</AppText>
                    <AppText>P1: Shower Paint</AppText>
                    <AppText>P2: Polycate paint</AppText>
                  </View>
                  <View>
                    <AppText>D: Dent</AppText>
                    <AppText>D1: Minor Dent</AppText>
                    <AppText>D2: Major Dent</AppText>
                  </View>
                  <View>
                    <AppText>S: Scratch</AppText>
                    <AppText>S1: Minor Scratch</AppText>
                    <AppText>S2: Major Scratch</AppText>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    gap: 10,
                  }}
                >
                  {Object.keys(carInfo.grouped_problems).map(
                    (location, index) => (
                      <View
                        key={index}
                        style={{
                          borderTopWidth: 0.8,
                          borderColor: colors.fontGrey,
                          paddingVertical: 10,
                        }}
                      >
                        {/* Show the problem location (e.g., 'Back Left Door') */}
                        <AppText
                          fontSize={mainStyles.h2FontSize}
                          fontFamily={mainStyles.appFontBold}
                          marginBottom={10}
                        >
                          Location: {location}
                        </AppText>

                        {/* Show all problems associated with the location */}
                        {carInfo.grouped_problems[location].map(
                          (problem, problemIndex) => (
                            <View
                              key={problemIndex}
                              style={{ marginBottom: 10 }}
                            >
                              <View style={{ flexDirection: "row", gap: 10 }}>
                                <AppText color={colors.fontGrey} width={100}>
                                  {problem.problem_name}:
                                </AppText>
                                <AppText>{problem.selected_value}</AppText>
                              </View>
                            </View>
                          )
                        )}

                        {/* Display the image once for the first problem that contains an image */}
                        {carInfo.grouped_problems[location].find(
                          (p) => p.image_uri
                        ) && (
                          <TouchableOpacity
                            style={{
                              height: 50,
                              width: 50,
                              objectFit: "cover",
                              borderRadius: 5,
                              overflow: "hidden",
                              marginTop: 10,
                            }}
                            onPress={() =>
                              openImageModal(
                                `${process.env.PROBLEMS_IMAGE_URL}${
                                  carInfo.grouped_problems[location].find(
                                    (p) => p.image_uri
                                  ).image_uri
                                }`
                              )
                            }
                          >
                            <Image
                              source={{
                                uri: `${process.env.PROBLEMS_IMAGE_URL}${
                                  carInfo.grouped_problems[location].find(
                                    (p) => p.image_uri
                                  ).image_uri
                                }`,
                              }}
                              style={{
                                height: 50,
                                width: 50,
                                objectFit: "cover",
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          )}

          {carInfo?.grouped_checkpoints &&
            Object.keys(carInfo.grouped_checkpoints).map((key, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.accordianTap}
                  onPress={() => toggleExpanded(key)} // Toggle the expanded state for this key
                  activeOpacity={0.8}
                >
                  <View style={styles.accordionHeader}>
                    <AppText>{key}</AppText>
                    <Feather
                      name={
                        expandedSections[key] ? "chevron-up" : "chevron-down"
                      }
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>

                {expandedSections[key] && (
                  <View>
                    {Object.keys(carInfo.grouped_checkpoints[key]).map(
                      (subKey, subIndex) => (
                        <View style={{ gap: 0 }} key={subIndex}>
                          <View style={{ paddingVertical: 20 }}>
                            <AppText
                              fontSize={mainStyles.h3FontSize}
                              paddingVertical={0}
                              fontFamily={mainStyles.appFontBold}
                            >
                              {subKey}
                            </AppText>
                          </View>

                          {carInfo.grouped_checkpoints[key][subKey].map(
                            (item, itemIndex) => (
                              <View
                                key={itemIndex}
                                style={{
                                  gap: 10,
                                  borderTopWidth: 0.8,
                                  borderColor: colors.fontGrey,
                                  paddingVertical: 20,
                                }}
                              >
                                <AppText>
                                  {questionNumber++}. {item.ind_question}
                                </AppText>
                                <View style={{ gap: 10 }}>
                                  <View
                                    style={{ gap: 10, flexDirection: "row" }}
                                  >
                                    <AppText
                                      color={colors.fontGrey}
                                      width={60}
                                      flex={1}
                                      height={16}
                                    >
                                      Condition:
                                    </AppText>
                                    <AppText
                                      fontFamily={mainStyles.appFontBold}
                                    >
                                      {item.value}
                                      {item.value.length === 1 && "/5"}
                                    </AppText>
                                  </View>
                                  {item.reason && (
                                    <View
                                      style={{ gap: 10, flexDirection: "row" }}
                                    >
                                      <AppText
                                        color={colors.fontGrey}
                                        width={60}
                                        flex={1}
                                      >
                                        Reason:
                                      </AppText>
                                      <AppText>{item.reason}:</AppText>
                                    </View>
                                  )}
                                  {item.point && (
                                    <View
                                      style={{ gap: 10, flexDirection: "row" }}
                                    >
                                      <AppText
                                        color={colors.fontGrey}
                                        width={60}
                                        flex={1}
                                      >
                                        Point:
                                      </AppText>
                                      <AppText>{item.point}:</AppText>
                                    </View>
                                  )}
                                  {item.image_uri && (
                                    <TouchableOpacity
                                      style={{
                                        height: 50,
                                        width: 50,
                                        objectFit: "cover",
                                        borderRadius: 5,
                                        overflow: "hidden",
                                      }}
                                      onPress={() =>
                                        openImageModal(
                                          `${process.env.INDICATORS_IMAGE_URL}${item.image_name}`
                                        )
                                      }
                                    >
                                      <Image
                                        source={{
                                          uri: `${process.env.INDICATORS_IMAGE_URL}${item.image_name}`,
                                        }}
                                        style={{
                                          height: 50,
                                          width: 50,
                                          objectFit: "cover",
                                        }}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            )
                          )}
                        </View>
                      )
                    )}
                  </View>
                )}
              </View>
            ))}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: colors.ligtGreyBg,
          padding: 20,
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        <Animated.View
          style={{
            backgroundColor: colors.ligtGreyBg,
            height: heightAnim,
            paddingBottom: 20,
            overflow: "hidden",
            position: "absolute",
            left: 20,
            bottom: 80,
            alignContent: "flex-start",
            opacity: heightAnimOpacity,
          }}
        >
          {/* First Item */}
          <Animated.View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.whiteBg,
                height: 60,
                opacity: opacityAnim, // Animate opacity
                overflow: "hidden",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderColor: colors.ligtGreyBg,
              }}
              onPress={saleToCustomer}
            >
              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h2FontSize}
              >
                Sell To Customer
              </AppText>
              <MaterialCommunityIcons
                name="brightness-percent"
                size={24}
                color={colors.fontBlack}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Second Item */}
          <Animated.View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.whiteBg,
                height: 60,
                opacity: opacityAnim, // Animate opacity
                overflow: "hidden",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderColor: colors.ligtGreyBg,
              }}
              onPress={downloadZip}
            >
              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h2FontSize}
              >
                Download Documents
              </AppText>

              <MaterialCommunityIcons
                name="folder-download-outline"
                size={24}
                color={colors.fontBlack}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Third Item */}
          <Animated.View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.whiteBg,
                height: 70,
                opacity: opacityAnim, // Animate opacity
                overflow: "hidden",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <AppText
                color={colors.fontBlack}
                fontSize={mainStyles.h2FontSize}
              >
                Download Pdf
              </AppText>
              <SimpleLineIcons
                name="cloud-download"
                size={24}
                color={colors.fontBlack}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <TouchableOpacity
          style={styles.ButtonContainer}
          onPress={() => setButtonOpen(!buttonOpen)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              colors.buttonGradient1,
              colors.buttonGradient2,
              colors.buttonGradient3,
            ]}
            start={[0, 0]}
            end={[0.6, 1]}
            style={styles.gredientButton}
          >
            <AppText color={colors.fontWhite} fontSize={mainStyles.h2FontSize}>
              Call To Action
            </AppText>
            <View style={{}}>
              <Feather
                name={buttonOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color="white"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
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
              overflow: "hidden",
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
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
};

export default SingleCarInfo;

const styles = StyleSheet.create({
  ContentContainer: {
    gap: 10,
  },
  contentBox: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colors.whiteBg,
    gap: 7,
    elevation: 2,
  },
  container: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 120,
  },
  line: {
    height: 20,
    width: 0.5,
    backgroundColor: colors.fontGrey,
  },
  ImageContainer: {
    flex: 1,
    height: "100%",
    minHeight: 400,
    marginBottom: 20,
  },
  carInfo: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  completeInfo: {
    marginBottom: 20,
  },
  carQuestionAccrodians: { gap: 10 },
  accordianTap: {
    padding: 10,
    elevation: 3,
    backgroundColor: colors.whiteBg,
    borderRadius: 5,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionContent: {
    padding: 20,
    gap: 7,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 100,
    height: 30,
    width: 30,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  ButtonContainer: {
    borderRadius: 5,
    overflow: "hidden",
  },
  gredientButton: {
    shadowColor: "#000000",
    elevation: 10,
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    elevation: 2,
    height: 60,
  },
});
