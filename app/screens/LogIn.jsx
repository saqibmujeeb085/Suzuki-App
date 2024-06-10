import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import AppScreen from "../components/screen/Screen";
import AppTextInput from "../components/formFields/TextInput";
import Dropdown from "../components/formFields/Dropdown";
import IconButton from "../components/buttons/IconButton";
import GradientButton from "../components/buttons/GradientButton";
import AppText from "../components/text/Text";
import { AuthContext } from "../context/authContext";
import { mainStyles } from "../constants/style";
import { colors } from "../constants/colors";
import ToastManager, { Toast } from "toastify-react-native";
import PasswordInput from "../components/formFields/PasswordInput";

const LogIn = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);

  const [dealershipList, setDealershipList] = useState([]);
  const [dealershipUserList, setDealershipUserList] = useState([]);

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

  
  
  
  useEffect(() => {
    if (
      selectedDealership !== "" &&
      selectedDealershipUser !== "" &&
      selectedDealershipUserPassword !== ""
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedDealership, selectedDealershipUser, selectedDealershipUserPassword]);
  
  
  
  useEffect(() => {
    fetchDealershipNames();
  }, []);




  useEffect(() => {
    if (selectedDealership) {
      fetchDealershipUserNames();
    }
  }, [selectedDealership]);

  const handleDealershipSelection = (selected) => {
    setSelectedDealership(selected);
    setErrors((prevErrors) => ({ ...prevErrors, dealership: "" }));
  };

  const handleDealershipUserSelection = (selected) => {
    setSelectedDealershipUser(selected);
    setErrors((prevErrors) => ({ ...prevErrors, user: "" }));
  };

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
      setDealershipList(
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
      url: `/auth/get_duser.php?did=${selectedDealership}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const dealershipsUsers = response.data;

      if (Array.isArray(dealershipsUsers)) {
        setDealershipUserList(
          dealershipsUsers.map((object) => ({
            key: object.duserid,
            value: object.userName,
          }))
        );
      } else {
        console.error("Unexpected API response format:", dealershipsUsers);
      }
    } catch (error) {
      console.error("Error fetching dealership data:", error);
    }
  };

  const handleUserLogin = async () => {
    let hasErrors = false;
    const newErrors = {
      dealership: "",
      user: "",
      password: "",
    };

    // if (!selectedDealership) {
    //   newErrors.dealership = "Please select a dealership";
    //   hasErrors = true;
    // }
    // if (!selectedDealershipUser) {
    //   newErrors.user = "Please select a user";
    //   hasErrors = true;
    // }
    // if (!selectedDealershipUserPassword) {
    //   newErrors.password = "Please enter a password";
    //   hasErrors = true;
    // }

    setErrors(newErrors);

    if (hasErrors) {
      Toast.error(
        <AppText fontSize={mainStyles.h3FontSize}>
          Please Select And Fill All The Fields
        </AppText>
      );
      return;
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/auth/login.php?userName=${selectedDealershipUser}&password=${selectedDealershipUserPassword}&dId=${selectedDealership}`,
      headers: {},
    };
    try {
      const response = await axios.request(config);
      if (response.data.code === 200) {
        setUserData(response.data);
        navigation.navigate("Home");
      } else {
        Toast.error(
        <AppText fontSize={mainStyles.h2FontSize}>
          {response.data.message}
        </AppText>
          )
      }
    } catch (error) {
      alert(error);
    }
  };

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
              fontSize={33}
              lineHeight={45}
              width={320}
              paddingLeft={20}
              paddingTop={70}
              paddingBottom={100}
            >
              Welcome to Suzuki Vehcile Valuation Portal.
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
                  Data={dealershipList}
                  Search={true}
                  save={"key"}
                  selectedItem={handleDealershipSelection}
                  Error={errors.dealership}
                />
                <Dropdown
                  DropItems="Dealership UserName"
                  Data={dealershipUserList}
                  save={"value"}
                  selectedItem={handleDealershipUserSelection}
                  Error={errors.user}
                />
                <PasswordInput
                  autoComplete="off"
                  placeholder="Enter Your Password Here"
                  onChangeText={(value) => {
                    setSelectedDealershipUserPassword(value);
                    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
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
                <GradientButton onPress={handleUserLogin} disabled={!allSelected}>
                  Sign in
                </GradientButton>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <AppText
                    width={300}
                    fontSize={mainStyles.h3FontSize}
                    color={colors.fontGrey}
                    textAlign={"center"}
                    lineHeight={14}
                  >
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
