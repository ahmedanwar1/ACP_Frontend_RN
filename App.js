import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Bookingcard from "./components/BookingCard";
import MapComponent from "./components/MapComponent";
import BookingScreen from "./screens/BookingScreen";
import HistoryScreen from "./screens/HistoryScreen";
import PickDestinationScreen from "./screens/PickDestinationScreen";
import LocationPermissionFailedScreen from "./screens/LocationPermissionFailedScreen";
import GPSConditionScreen from "./screens/GPSConditionScreen";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { useSelector, useDispatch } from "react-redux";
import {
  setGPSEnabled,
  setCurrentCoords,
  selectCurrentCoords,
  selectGPSEnabled,
} from "./store/slices/mapSlice";
import Main from "./screens/Main";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Main />
        {/* <HistoryScreen /> */}
        {/* <BookingScreen /> */}
        <StatusBar backgroundColor="rgba(0,0,0,0)" />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({});
