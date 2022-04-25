import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Bookingcard from "./components/BookingCard";
import MapComponent from "./components/MapComponent";
import BookingScreen from "./screens/BookingScreen";
import HistoryScreen from "./screens/HistoryScreen";
import PickDestinationScreen from "./screens/PickDestinationScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <PickDestinationScreen />
      {/* <HistoryScreen /> */}
      {/* <BookingScreen /> */}
      <StatusBar backgroundColor="rgba(0,0,0,0)" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
