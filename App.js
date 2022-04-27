import "react-native-gesture-handler";

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

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Drawer.Navigator initialRouteName="Main">
            <Drawer.Screen name="Main" component={Main} />
            <Drawer.Screen name="BookingScreen" component={BookingScreen} />
            <Drawer.Screen name="historyScreen" component={HistoryScreen} />
          </Drawer.Navigator>
          {/* <Main /> */}
          {/* <HistoryScreen /> */}
          {/* <BookingScreen /> */}
          <StatusBar backgroundColor="rgba(0,0,0,0)" />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
