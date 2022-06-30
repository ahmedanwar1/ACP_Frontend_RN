import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setGPSEnabled,
  setCurrentCoords,
  selectCurrentCoords,
  selectGPSEnabled,
  checkIfLocationEnabled,
  getCurrentLocation,
  selectRemainingTimeToArrive,
  selectDestinationCoords,
  selectParkedCarLocation,
  setDestinationCoords,
  setParkedCarLocation,
} from "../store/slices/mapSlice";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PickDestinationScreen from "../screens/PickDestinationScreen";
import LocationPermissionFailedScreen from "../screens/LocationPermissionFailedScreen";
import GPSConditionScreen from "../screens/GPSConditionScreen";
import DisplayParkingSpacesScreen from "../screens/DisplayParkingSpacesScreen";
import MenuIcon from "../components/MenuIcon";
import CarNavigationScreen from "../screens/CarNavigationScreen";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import DisplayParkedCarLocation from "../screens/DisplayParkedCarLocation";
import {
  selectUserInfo,
  selectUserToken,
  setUserInfo,
  setUserToken,
} from "../store/slices/userSlice";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import axios from "axios";
import Constants from "expo-constants";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerStyle: {
              backgroundColor: "rgba(0,0,0,0)",
            },
            headerTransparent: true,
            title: "",
            // headerLeft: () => <MenuIcon />,
          }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{
            title: "Welcome to ACP",
            headerTitleAlign: "center",
            headerTintColor: "#39B66A",
            // headerTintColor: "#fff",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
