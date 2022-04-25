import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Bookingcard from "./components/BookingCard";
import MapComponent from "./components/MapComponent";
import BookingScreen from "./screens/BookingScreen";
import HistoryScreen from "./screens/HistoryScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* <HistoryScreen /> */}
      <BookingScreen />
      {/* <MapComponent /> */}
      <StatusBar backgroundColor="rgba(0,0,0,0)" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
});
