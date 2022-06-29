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

  //check frequently that GPS is enabled
  let checkGPS;

  const getUserStatus = async () => {
    axios
      .get(`http://${manifest.debuggerHost.split(":").shift()}:4000/userStatus`)
      .then((response) => {
        console.log(response.data);
        if (response.data.userStatus == "navigating") {
          // dispatch(
          // setParkedCarLocation({
          //   longitude: destinationCoords[1],
          //   latitude: destinationCoords[0],
          // })
          // );
          dispatch(setDestinationCoords(response.data.coordinates));
        } else if (response.data.userStatus == "parked") {
          dispatch(
            setParkedCarLocation({
              longitude: response.data.coordinates[1],
              latitude: response.data.coordinates[0],
            })
          );
          // dispatch(setDestinationCoords(response.data.coordinates))
        }
      })
      .catch((error) => console.log(error));

    // const getUserToken = await AsyncStorage.getItem("userToken");
    // const getUserInfo = await AsyncStorage.getItem("userInfo");
    // if (getUserToken && getUserInfo) {
    //   dispatch(setUserToken(getUserToken));
    //   dispatch(setUserInfo(getUserInfo));
    // }
  };

  useEffect(() => {
    const isLoggedin = async () => {
      const getUserToken = await AsyncStorage.getItem("userToken");
      const getUserInfo = await AsyncStorage.getItem("userInfo");
      if (getUserToken && getUserInfo) {
        dispatch(setUserToken(getUserToken));
        dispatch(setUserInfo(getUserInfo));
      }
    };
    isLoggedin();
    getUserStatus();
  }, []);

  const { manifest } = Constants;
  useEffect(() => {
    getUserStatus();
  }, [userToken]);

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
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      // console.log(response.data.success == false);
      if (
        response.data.success != undefined &&
        response.data.success == false
      ) {
        dispatch(setUserToken(null));
        dispatch(setUserInfo(null));
        AsyncStorage.removeItem("userToken");
        AsyncStorage.removeItem("userInfo");
        // return { data: { errorMsg: response.data.message, success: false } };
      }
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    checkGPS = setInterval(async () => {
      await dispatch(checkIfLocationEnabled());
      // console.log("GPS: ", GPSEnabled, currentCoords);
    }, 3000);
    return () => clearInterval(checkGPS);
  }, [GPSEnabled]);

  if (!userToken || !userInfo) {
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
  } else {
    //if GPS is not on
    if (!GPSEnabled) {
      return <GPSConditionScreen />;
    }

    //if there is no coords (permission)
    if (!currentCoords) {
      return <LocationPermissionFailedScreen />;
    }

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
  }
};

export default MapStack;

const styles = StyleSheet.create({});
