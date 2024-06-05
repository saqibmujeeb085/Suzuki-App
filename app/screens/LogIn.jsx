import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import axios from "axios";
import AppScreen from "../components/screen/Screen";
import AppTextInput from "../components/formFields/TextInput";
import Dropdown from "../components/formFields/Dropdown";
import IconButton from "../components/buttons/IconButton";
import GradientButton from "../components/buttons/GradientButton";
import { Dimensions } from "react-native";
import AppText from "../components/text/Text";
import { AuthContext } from "../context/authContext";

const LogIn = ({ navigation }) => {
  const windowHeight = Dimensions.get("window").height;

  const [userData, setUserData] = useContext(AuthContext);
  console.log(userData);

  const [dealershipList, setDealershipList] = useState([]);
  const [dealershipUserList, setDealershipUserList] = useState([]);

  const [selectedDealership, setSelectedDealership] = useState("");
  const [selectedDealershipUser, setSelectedDealershipUser] = useState("");
  const [selectedDealershipUserPassword, setSelectedDealershipUserPassword] =
    useState("");

  useEffect(() => {
    dealershipName();
  }, []);

  useEffect(() => {
    if (selectedDealership >= 1) {
      dealershipUserName();
    }
  }, [selectedDealership]);

  const DealershipSelected = (selected) => {
    setSelectedDealership(selected);
  };
  const DealershipUserSelected = (selected) => {
    setSelectedDealershipUser(selected);
  };

  const dealershipName = async () => {
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

  const dealershipUserName = async () => {
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

  const userLogin = async () => {
    if (
      selectedDealershipUser !== "" &&
      selectedDealershipUserPassword !== "" &&
      selectedDealership !== ""
    ) {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `/auth/login.php?userName=${selectedDealershipUser}&password=${selectedDealershipUserPassword}&dId=${selectedDealership}`,
          headers: {},
        };

        const response = await axios.request(config);
        if (response.data.code === 200) {
          setUserData(response.data);
          navigation.navigate("Home");
          alert("Login Successfully");
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Please select both fields and type your password");
    }
  };

  return (
    <AppScreen>
      <ImageBackground
        style={styles.fullScreenBackground}
        source={require("../assets/login/screen-background.png")}
      >
        <KeyboardAwareScrollView>
          <View style={{ height: windowHeight }}>
            <ImageBackground
              style={styles.headerBackground}
              source={require("../assets/login/header-background.png")}
            >
              <Text style={styles.headerHeading}>
                Welcome to Suzuki Vehcile Valuation Portal.
              </Text>
            </ImageBackground>
            <View style={styles.formAndCopyright}>
              <View style={styles.formContainer}>
                <Text style={styles.pageHeading}>Sign In</Text>
                <View style={styles.formFieldContainer}>
                  <Dropdown
                    DropItems="Dealership Name"
                    Data={dealershipList}
                    Search={true}
                    save={"key"}
                    selectedItem={DealershipSelected}
                  />
                  <Dropdown
                    DropItems="Dealership UserName"
                    Data={dealershipUserList}
                    save={"value"}
                    selectedItem={DealershipUserSelected}
                  />
                  <AppTextInput
                    autoComplete="off"
                    placeholder="Enter Your Password Here"
                    onChangeText={(value) =>
                      setSelectedDealershipUserPassword(value)
                    }
                  />
                  <View style={styles.forgetBtn}>
                    <IconButton
                      icon={"account-key-outline"}
                      onPress={() => navigation.navigate("ForgetPassword")}
                    >
                      Forget Password
                    </IconButton>
                  </View>
                  <GradientButton onPress={userLogin}>Sign in</GradientButton>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AppText
                      width={300}
                      fontSize={10}
                      color={"#8b8b8b"}
                      textAlign={"center"}
                      lineHeight={14}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </AppText>
                  </View>
                </View>
              </View>
              <AppText
                marginTop={10}
                marginBottom={20}
                textAlign={"center"}
                color={"#6B6B6B"}
                fontSize={10}
              >
                &copy; Powered by Suzuki
              </AppText>
            </View>
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
  },
  formAndCopyright: {
    flex: 1,
    justifyContent: "flex-start",
  },
  headerBackground: {
    justifyContent: "center",
  },
  headerHeading: {
    color: "white",
    fontSize: 33,
    fontFamily: "suzukiRegular",
    lineHeight: 45,
    width: 320,
    paddingLeft: 20,
    paddingTop: 70,
    paddingBottom: 100,
  },
  formContainer: {
    alignItems: "center",
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  pageHeading: {
    fontSize: 30,
    color: "#003790",
    borderBottomWidth: 2,
    borderColor: "#003790",
    paddingBottom: 5,
    fontWeight: "600",
    marginBottom: 20,
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
