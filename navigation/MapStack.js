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
// const CarLocationStack = createNativeStackNavigator();

const MapStack = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let GPSEnabled = useSelector(selectGPSEnabled);
  let currentCoords = useSelector(selectCurrentCoords);
  let remainingTimeToArrive = useSelector(selectRemainingTimeToArrive);

  //tesssssssssst (remove it)
  const navigatingUser = useSelector(selectDestinationCoords);
  const carIsParked = useSelector(selectParkedCarLocation);

  const userInfo = useSelector(selectUserInfo);
  const userToken = useSelector(selectUserToken);

  if (!carIsParked && !navigatingUser) {
    return (
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="PickDestinationScreen"
            component={PickDestinationScreen}
            options={{
              headerStyle: {
                backgroundColor: "rgba(0,0,0,0)",
              },
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
      </Stack.Navigator>
    );
  }

  if (navigatingUser && !carIsParked) {
    return (
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="CarNavigationScreen"
            component={CarNavigationScreen}
            options={{
              headerStyle: {
                backgroundColor: "#39B66A",
              },
              headerTitleAlign: "center",
              title: `Arrive in ${remainingTimeToArrive} mins`,
              headerTintColor: "#fff",
              headerLeft: () => (
                <Icon
                  name="bars"
                  type="font-awesome-5"
                  color="#fff"
                  style={{ paddingLeft: 2 }}
                  size={22}
                  onPress={() =>
                    navigation.dispatch(DrawerActions.openDrawer())
                  }
                />
              ),
              // headerRight: () => (
              //   <Text style={{ color: "#fff", fontSize: 16 }}>11.2 Km</Text>
              // ),
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    );
  }

  if (/*!navigatingUser &&*/ carIsParked) {
    return (
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="DisplayParkedCarLocation"
            component={DisplayParkedCarLocation}
            options={{
              headerStyle: {
                backgroundColor: "#39B66A",
              },
              headerTitleAlign: "center",
              title: `Car's location`,
              headerTintColor: "#fff",
              headerLeft: () => (
                <Icon
                  name="bars"
                  type="font-awesome-5"
                  color="#fff"
                  style={{ paddingLeft: 2 }}
                  size={22}
                  onPress={() =>
                    navigation.dispatch(DrawerActions.openDrawer())
                  }
                />
              ),
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    );
  }
};

export default MapStack;

const styles = StyleSheet.create({});
