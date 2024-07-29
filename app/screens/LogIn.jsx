import React, { useState, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppScreen from "../components/screen/Screen";
import Dropdown from "../components/formFields/Dropdown";
import IconButton from "../components/buttons/IconButton";
import GradientButton from "../components/buttons/GradientButton";
import AppText from "../components/text/Text";
import { AuthContext } from "../context/authContext";
import { mainStyles } from "../constants/style";
import { colors } from "../constants/colors";
import ToastManager, { Toast } from "toastify-react-native";
import PasswordInput from "../components/formFields/PasswordInput";
import { LoginDataContext } from "../context/loginDataContext";

const LogIn = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useContext(AuthContext);
  const [
    loginDealershipData,
    setLoginDealershipData,
    loginDealershipUserData,
    setLoginDealershipUserData,
  ] = useContext(LoginDataContext);

  const [dealershipUserRawList, setDealershipUserRawList] = useState([]);

  // Your state and handlers
  const [allSelected, setAllSelected] = useState(false);
  const [selectedDealership, setSelectedDealership] = useState("");
  const [selectedDealershipUser, setSelectedDealershipUser] = useState("");
  const [selectedDealershipUserPassword, setSelectedDealershipUserPassword] =
    useState("");

  const [errors, setErrors] = useState({
    dealership: "",
    user: "",
    password: "",
  });

  // LoginData Preload

  useEffect(() => {
    fetchDealershipNames();
    fetchDealershipUserNames();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      selectedDealership &&
      selectedDealershipUser &&
      selectedDealershipUserPassword
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [
    selectedDealership,
    selectedDealershipUser,
    selectedDealershipUserPassword,
  ]);

  // Loading Data

  const fetchDealershipNames = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_dealerships.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      let dealerships = response.data;
      setLoginDealershipData(
        dealerships.map((object) => ({
          key: object.did,
          value: object.dname,
        }))
      );
    } catch (error) {
      console.error("Error fetching dealership data:", error);
    }
  };

  const fetchDealershipUserNames = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/auth/get_dusernew.php",
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const dealershipsUsers = response.data;

      // Update the raw list state
      setDealershipUserRawList(dealershipsUsers);

      // Transform the raw list to the required format
      const transformedList = dealershipsUsers.reduce((acc, dealership) => {
        acc[dealership.dealershipID] = dealership.userData.map((user) => ({
          key: user.dealerUserID,
          value: user.DealershipUserName,
        }));
        return acc;
      }, {});

      setLoginDealershipUserData(transformedList);
    } catch (error) {
      console.error("Error fetching dealership user data:", error);
    }
  };

  // Handle dealership selection
  const handleDealershipSelection = (selected) => {
    setSelectedDealership(selected);
    setErrors((prevErrors) => ({ ...prevErrors, dealership: "" }));
  };

  // Handle dealership user selection
  const handleDealershipUserSelection = (selected) => {
    setSelectedDealershipUser(selected);
    setErrors((prevErrors) => ({ ...prevErrors, user: "" }));
  };

  // Handle user login
  const handleUserLogin = async () => {
    const newErrors = {
      dealership: !selectedDealership ? "Please select a dealership" : "",
      user: !selectedDealershipUser ? "Please select a user" : "",
      password: !selectedDealershipUserPassword
        ? "Please enter a password"
        : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      Toast.error(
        <AppText fontSize={mainStyles.h3FontSize}>
          Please select and fill all the fields
        </AppText>
      );
      return;
    }

    try {
      const response = await axios.get(
        `/auth/login.php?userName=${selectedDealershipUser}&password=${selectedDealershipUserPassword}&dId=${selectedDealership}`
      );

      if (response.data.code === 200) {
        setUserData(response.data);
        Toast.success("Login successful!");
      } else {
        Toast.error(
          <AppText fontSize={mainStyles.h2FontSize}>
            {response.data.message}
          </AppText>
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      Toast.error("Login failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AppScreen>
      <ToastManager />
      <ImageBackground
        style={styles.fullScreenBackground}
        source={require("../assets/login/screen-background.png")}
      >
        <KeyboardAwareScrollView>
          <ImageBackground
            style={styles.headerBackground}
            source={require("../assets/login/header-background.png")}
          >
            <AppText
              color={colors.fontWhite}
              fontSize={38}
              lineHeight={48}
              width={340}
              paddingLeft={20}
              paddingTop={70}
              paddingBottom={100}
            >
              Welcome to Suzuki Vehicle Valuation Portal.
            </AppText>
          </ImageBackground>
          <View style={styles.formAndCopyright}>
            <View style={styles.formContainer}>
              <AppText
                fontSize={25}
                color={colors.purple}
                borderBottomWidth={2}
                borderColor={colors.purple}
                paddingBottom={5}
                fontFamily={mainStyles.appFontBold}
              >
                Sign In
              </AppText>
              <View style={styles.formFieldContainer}>
                <Dropdown
                  DropItems="Dealership Name"
                  Data={loginDealershipData}
                  Search={true}
                  save={"key"}
                  selectedItem={handleDealershipSelection}
                  Error={errors.dealership}
                />
                <Dropdown
                  DropItems="Dealership UserName"
                  Data={loginDealershipUserData[selectedDealership] || []}
                  save={"value"}
                  selectedItem={handleDealershipUserSelection}
                  Error={errors.user}
                />
                <PasswordInput
                  autoComplete="off"
                  placeholder="Enter Your Password Here"
                  onChangeText={(value) => {
                    setSelectedDealershipUserPassword(value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      password: "",
                    }));
                  }}
                  Error={errors.password}
                />
                <View style={styles.forgetBtn}>
                  <IconButton
                    icon={"account-key-outline"}
                    onPress={() => navigation.navigate("ForgetPassword")}
                  >
                    Forget Password
                  </IconButton>
                </View>
                <GradientButton
                  onPress={handleUserLogin}
                  disabled={!allSelected}
                >
                  Sign in
                </GradientButton>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    width={300}
                    fontSize={mainStyles.h3FontSize}
                    color={colors.fontGrey}
                    textAlign={"center"}
                  >
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </AppText>
                </View>
              </View>
            </View>
            <AppText
              textAlign={"center"}
              color={colors.fontGrey}
              fontSize={mainStyles.h3FontSize}
              marginBottom={20}
            >
              &copy; Powered by Suzuki
            </AppText>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </AppScreen>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenBackground: {
    flex: 1,
    gap: 20,
  },
  formAndCopyright: {
    flex: 1,
    justifyContent: "space-between",
    gap: 20,
  },
  headerBackground: {
    justifyContent: "center",
  },
  formContainer: {
    alignItems: "center",
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    gap: 20,
  },
  formFieldContainer: {
    width: "100%",
    gap: 10,
  },
  forgetBtn: {
    alignItems: "flex-end",
    marginTop: 5,
    marginBottom: 20,
  },
});
