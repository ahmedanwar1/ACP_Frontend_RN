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
import MapStack from "./navigation/MapStack";

import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import MenuIcon from "./components/MenuIcon";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <MyDrawer />
          {/* <Main /> */}
          {/* <HistoryScreen /> */}
          {/* <BookingScreen /> */}
          <StatusBar backgroundColor="rgba(0,0,0,0)" />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const MyDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="MapStack">
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
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({});
