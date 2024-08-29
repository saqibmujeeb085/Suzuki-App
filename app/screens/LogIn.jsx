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
import IconButton from "../components/buttons/IconButton";
import GradientButton from "../components/buttons/GradientButton";
import AppText from "../components/text/Text";
import { AuthContext } from "../context/authContext";
import { mainStyles } from "../constants/style";
import { colors } from "../constants/colors";
import ToastManager, { Toast } from "toastify-react-native";
import PasswordInput from "../components/formFields/PasswordInput";
import { LoginDataContext } from "../context/loginDataContext";
import AppTextInput from "../components/formFields/TextInput";

const LogIn = ({ navigation }) => {
  const [userData, setUserData] = useContext(AuthContext);

  // Your state and handlers
  const [allSelected, setAllSelected] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedDealershipUserPassword, setSelectedDealershipUserPassword] =
    useState("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (selectedUsername && selectedDealershipUserPassword) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedUsername, selectedDealershipUserPassword]);

  // Handle username change
  const handleUsernameChange = (value) => {
    setSelectedUsername(value);
    setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
  };

  // Handle user login
  const handleUserLogin = async () => {
    console.log(selectedDealershipUserPassword, selectedUsername);

    const newErrors = {
      username: !selectedUsername ? "Please enter a username" : "",
      password: !selectedDealershipUserPassword
        ? "Please enter a password"
        : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      Toast.error(
        <AppText fontSize={mainStyles.h3FontSize}>
          Please fill all the fields
        </AppText>
      );
      return;
    }

    try {
      const response = await axios.get(
        `/auth/loginuser.php?newUserName=${selectedUsername}&password=${selectedDealershipUserPassword}`
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
              Welcome to Suzuki Vehicle Evaluation Portal.
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
                <AppTextInput
                  autoComplete="off"
                  placeholder="Enter Your Username Here"
                  onChangeText={handleUsernameChange}
                  Error={errors.username}
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
                <GradientButton
                  onPress={handleUserLogin}
                  disabled={!allSelected}
                >
                  Sign in
                </GradientButton>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 50,
                  }}
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
});
