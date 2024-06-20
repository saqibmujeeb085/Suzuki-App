import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "../screens/Home";
import Reports from "../screens/Reports";
import Drafts from "../screens/Drafts";
import Settings from "../screens/Settings";
import NewInspectionButton from "./NewInspectionButton";
import NewInspectionNavigation from "./NewInspectionNavigation";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { mainStyles } from "../constants/style";
import { colors } from "../constants/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          justifyContent: "center",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: "#F1F1F1",
        },
        tabBarLabelStyle: {
          fontSize: mainStyles.h4FontSize,
          top: -6,
        },
        tabBarItemStyle: {
          alignItems: "center",
          gap: 0,
        },
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.fontBlack,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={Reports}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="profile"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewInspection"
        component={NewInspectionPlaceholder} // Use a placeholder component
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewInspectionButton
              onPress={() => navigation.navigate("NewInspectionModal")}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Draft"
        component={Drafts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="form"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="setting"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const NewInspectionPlaceholder = () => {
  return null;
};

const BottomTabNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="NewInspectionModal"
        component={NewInspectionNavigation}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default BottomTabNavigation;
