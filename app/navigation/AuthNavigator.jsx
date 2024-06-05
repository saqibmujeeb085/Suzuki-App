import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import LogIn from "../screens/LogIn";
import ForgetPassword from "../screens/ForgetPassword";

const Stack = createStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="LogIn"
        component={LogIn}
      />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
