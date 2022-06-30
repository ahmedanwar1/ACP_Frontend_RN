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
import AuthStack from "./AuthStack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MapStack from "./MapStack";
import BookingScreen from "../screens/BookingScreen";
import HistoryScreen from "../screens/HistoryScreen";
import CustomDrawer from "../components/CustomDrawer";

const Stack = createNativeStackNavigator();
// const CarLocationStack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const Main = () => {
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
  const { manifest } = Constants;

  //check frequently that GPS is enabled
  let checkGPS;

  const getUserStatus = async () => {
    axios
      .get(`http://${manifest.debuggerHost.split(":").shift()}:4000/userStatus`)
      .then((response) => {
        console.log(response.data);
        if (response.data.userStatus == "navigating") {
          dispatch(setDestinationCoords(response.data.coordinates));
        } else if (response.data.userStatus == "parked") {
          dispatch(
            setParkedCarLocation({
              longitude: response.data.coordinates[1],
              latitude: response.data.coordinates[0],
            })
          );
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const isLoggedin = async () => {
      const getUserToken = await AsyncStorage.getItem("userToken");
      const getUserInfo = await AsyncStorage.getItem("userInfo");
      if (getUserToken && getUserInfo) {
        dispatch(setUserToken(getUserToken));
        dispatch(setUserInfo(JSON.parse(getUserInfo)));
      }
    };
    isLoggedin();
    // getUserStatus();
  }, []);

  useEffect(() => {
    if (userToken) {
      getUserStatus();
    }
  }, [userToken]);

  useEffect(() => {
    checkGPS = setInterval(async () => {
      await dispatch(checkIfLocationEnabled());
      // console.log("GPS: ", GPSEnabled, currentCoords);
    }, 3000);
    return () => clearInterval(checkGPS);
  }, [GPSEnabled]);

  axios.interceptors.request.use(
    async (config) => {
      const getUserToken = await AsyncStorage.getItem("userToken");
      // Do something before request is sent
      if (getUserToken) {
        config.headers.Authorization = `Bearer ${getUserToken}`;
      } else {
        dispatch(setUserToken(null));
        dispatch(setUserInfo(null));
        AsyncStorage.removeItem("userToken");
        AsyncStorage.removeItem("userInfo");
      }
      // console.log("hi", config.headers.Authorization, getUserToken, userInfo);
      // console.log(userToken, "hhhhhhh");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    async (response) => {
      if (
        response.data.authSuccess != undefined &&
        response.data.authSuccess == false
      ) {
        dispatch(setUserToken(null));
        dispatch(setUserInfo(null));
        AsyncStorage.removeItem("userToken");
        AsyncStorage.removeItem("userInfo");
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  if (!userToken || !userInfo) {
    return <AuthStack />;
  } else {
    //if GPS is not on
    if (!GPSEnabled) {
      return <GPSConditionScreen />;
    }

    //if there is no coords (permission)
    if (!currentCoords) {
      return <LocationPermissionFailedScreen />;
    }

    return <MyDrawer />;
  }
};

export default Main;

const styles = StyleSheet.create({});

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="MapStack"
    >
      <Drawer.Screen
        name="MapStack"
        component={MapStack}
        options={{
          headerShown: false,
          // headerTintColor: "transparent",
          title: "Reservation",
        }}
      />
      <Drawer.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{
          title: "Booking",
          headerTintColor: "#39B66A",
          headerTitleAlign: "center",
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="historyScreen"
        component={HistoryScreen}
        options={{
          // headerTransparent: true,
          headerTintColor: "#39B66A",
          headerTitleAlign: "center",
          title: "History",
          headerStyle: {},
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
};
