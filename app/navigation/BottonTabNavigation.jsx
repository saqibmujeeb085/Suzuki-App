import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import Home from "../screens/Home";
import Reports from "../screens/Reports";
import NewInspectionNavigation from "./NewInspectionNavigation";
import Drafts from "../screens/Drafts";
import Settings from "../screens/Settings";
import NewInspectionButton from "./NewInspectionButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BottonTabNavigation = () => {
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
          fontSize: 8,
          top: -6,
        },
        tabBarItemStyle: {
          alignItems: "center",
          gap: 0,
        },
        tabBarActiveTintColor: "#003790",
        tabBarInactiveTintColor: "#2E2E2E",
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
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
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewInspection"
        component={NewInspectionNavigation}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewInspectionButton
              onPress={() => navigation.navigate("NewInspection")}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Draft"
        component={Drafts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="note-edit-outline"
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
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottonTabNavigation;
