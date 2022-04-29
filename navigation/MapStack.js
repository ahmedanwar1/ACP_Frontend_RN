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
} from "../store/slices/mapSlice";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PickDestinationScreen from "../screens/PickDestinationScreen";
import LocationPermissionFailedScreen from "../screens/LocationPermissionFailedScreen";
import GPSConditionScreen from "../screens/GPSConditionScreen";
import DisplayParkingSpacesScreen from "../screens/DisplayParkingSpacesScreen";
import MenuIcon from "../components/MenuIcon";
import CarNavigationScreen from "../screens/CarNavigationScreen";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import DisplayParkedCarLocation from "../screens/DisplayParkedCarLocation";

const Stack = createNativeStackNavigator();
const CarLocationStack = createNativeStackNavigator();

const MapStack = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let GPSEnabled = useSelector(selectGPSEnabled);
  let currentCoords = useSelector(selectCurrentCoords);
  let remainingTimeToArrive = useSelector(selectRemainingTimeToArrive);

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

  //if GPS is not on
  if (!GPSEnabled) {
    return <GPSConditionScreen />;
  }

  //if there is no coords (permission)
  if (!currentCoords) {
    return <LocationPermissionFailedScreen />;
  }

  return (
    <Stack.Navigator>
      {/* {!carIsParked && !userIsApprochingSpace ? ( */}
      {/* // Screens for logged in users */}
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
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="CarNavigationScreen"
          component={CarNavigationScreen}
          options={{
            headerStyle: {
              // backgroundColor: "rgba(0,0,0,0)",
              backgroundColor: "#39B66A",
              // marginTop:
              //   Platform.OS === "android" ? StatusBar.currentHeight : 0,
            },
            // headerShown: false,
            // headerTransparent: true,
            headerTitleAlign: "center",
            title: `Arrive in ${remainingTimeToArrive} mins`,
            headerTintColor: "#fff",
            // headerLeft: () => <MenuIcon />,
            headerLeft: () => (
              <Icon
                // raised
                name="bars"
                type="font-awesome-5"
                color="#fff"
                style={{ paddingLeft: 2 }}
                size={22}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              />
            ),
          }}
        />

        <Stack.Screen
          name="DisplayParkedCarLocation"
          component={DisplayParkedCarLocation}
          options={{
            headerStyle: {
              backgroundColor: "#39B66A",
            },
            // headerShown: false,
            // headerTransparent: true,
            headerTitleAlign: "center",
            title: `Remaining time: 50 mins`,
            headerTintColor: "#fff",
            // headerLeft: () => <MenuIcon />,
            headerLeft: () => (
              <Icon
                // raised
                name="bars"
                type="font-awesome-5"
                color="#fff"
                style={{ paddingLeft: 2 }}
                size={22}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              />
            ),
          }}
        />
      </Stack.Group>

      {/* ) : ( */}
      {/* <View>tessst</View> */}
      {/* )} */}
    </Stack.Navigator>
  );
};

export default MapStack;

const styles = StyleSheet.create({});
