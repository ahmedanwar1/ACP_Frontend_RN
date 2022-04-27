import { StyleSheet, Text, View } from "react-native";
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

import PickDestinationScreen from "./PickDestinationScreen";
import LocationPermissionFailedScreen from "./LocationPermissionFailedScreen";
import GPSConditionScreen from "./GPSConditionScreen";
import DisplayParkingSpacesScreen from "./DisplayParkingSpacesScreen";
import MenuIcon from "../components/MenuIcon";

const Stack = createNativeStackNavigator();

const Main = () => {
  const dispatch = useDispatch();

  const GPSEnabled = useSelector(selectGPSEnabled);
  const currentCoords = useSelector(selectCurrentCoords);

  //tesssssssssst (remove it)
  const userIsApprochingSpace = false;
  const carIsParked = false;

  //check frequently that GPS is enabled
  let checkGPS;
  useEffect(() => {
    checkGPS = setInterval(async () => {
      await dispatch(checkIfLocationEnabled());
      console.log("GPS: ", GPSEnabled, currentCoords);
    }, 7000);
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
              // headerStyle: { backgroundColor: "rgba(0,0,0,0)",  },
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
        </Stack.Group>
      ) : (
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

export default Main;

const styles = StyleSheet.create({});
