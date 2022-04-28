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
} from "../store/slices/mapSlice";

import * as Location from "expo-location";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PickDestinationScreen from "../screens/PickDestinationScreen";
import LocationPermissionFailedScreen from "../screens/LocationPermissionFailedScreen";
import GPSConditionScreen from "../screens/GPSConditionScreen";
import DisplayParkingSpacesScreen from "../screens/DisplayParkingSpacesScreen";
import MenuIcon from "../components/MenuIcon";
import CarNavigationScreen from "../screens/CarNavigationScreen";

const Stack = createNativeStackNavigator();

const MapStack = () => {
  const dispatch = useDispatch();

  let GPSEnabled = useSelector(selectGPSEnabled);
  let currentCoords = useSelector(selectCurrentCoords);

  //tesssssssssst (remove it)
  const userIsApprochingSpace = false;
  const carIsParked = false;

  //check frequently that GPS is enabled
  let checkGPS;
  useEffect(() => {
    checkGPS = setInterval(async () => {
      await dispatch(checkIfLocationEnabled());
      console.log("GPS: ", GPSEnabled, currentCoords);
    }, 3000);
    return () => clearInterval(checkGPS);
  }, [GPSEnabled]);

  if (!GPSEnabled) {
    return <GPSConditionScreen />;
  }
  if (!currentCoords) {
    return <LocationPermissionFailedScreen />;
  }
  // return <PickDestinationScreen />;

  return (
    <Stack.Navigator>
      {!carIsParked && !userIsApprochingSpace ? (
        // Screens for logged in users
        <Stack.Group>
          <Stack.Screen
            name="PickDestinationScreen"
            component={PickDestinationScreen}
            // options={{ headerShown: false }}
            options={{
              headerStyle: {
                backgroundColor: "rgba(0,0,0,0)",
                // marginTop:
                //   Platform.OS === "android" ? StatusBar.currentHeight : 0,
              },
              // headerShown: false,
              headerTransparent: true,
              title: "",
              headerLeft: () => <MenuIcon />,
            }}
          />
          <Stack.Screen
            name="DisplayParkingSpacesScreen"
            component={DisplayParkingSpacesScreen}
            options={{
              title: "PICK YOUR SPACE",
              headerTitleAlign: "center",
              headerTintColor: "#39B66A",
            }}
          />
          <Stack.Screen
            name="CarNavigationScreen"
            component={CarNavigationScreen}
            options={{
              headerStyle: {
                backgroundColor: "rgba(0,0,0,0)",
                // marginTop:
                //   Platform.OS === "android" ? StatusBar.currentHeight : 0,
              },
              // headerShown: false,
              headerTransparent: true,
              title: "",
              headerLeft: () => <MenuIcon />,
            }}
          />
        </Stack.Group>
      ) : (
        // <Stack.Navigator>
        // </Stack.Navigator>
        <View>hiiiiiiii there</View>
        // Auth screens
        // <Stack.Group screenOptions={{ headerShown: false }}>
        //   <Stack.Screen name="SignIn" component={SignIn} />
        //   <Stack.Screen name="SignUp" component={SignUp} />
        // </Stack.Group>
      )}
      {/* Common modal screens */}
      {/* <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="Invite" component={Invite} />
      </Stack.Group> */}
    </Stack.Navigator>
  );
};

export default MapStack;

const styles = StyleSheet.create({});
