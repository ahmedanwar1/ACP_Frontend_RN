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

import PickDestinationScreen from "./PickDestinationScreen";
import LocationPermissionFailedScreen from "./LocationPermissionFailedScreen";
import GPSConditionScreen from "./GPSConditionScreen";

const Main = () => {
  const dispatch = useDispatch();

  const GPSEnabled = useSelector(selectGPSEnabled);
  const currentCoords = useSelector(selectCurrentCoords);

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
  return <PickDestinationScreen />;
};

export default Main;

const styles = StyleSheet.create({});
