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

const bookingHistoryData = [
  {
    _id: 1,
    origin: {
      name: "Bakos",
      date: "Feb 12, 15:30",
    },
    destination: {
      name: "AAST",
      date: "Feb 12, 16:40",
    },
    price: 15,
  },
  {
    _id: 2,
    origin: {
      name: "Bakos",
      date: "Feb 12, 15:30",
    },
    destination: {
      name: "AAST",
      date: "Feb 12, 16:40",
    },
    price: 15,
  },
  {
    _id: 3,
    origin: {
      name: "Bakos",
      date: "Feb 12, 15:30",
    },
    destination: {
      name: "AAST",
      date: "Feb 12, 16:40",
    },
    price: 15,
  },
  {
    _id: 6,
    origin: {
      name: "Bakos",
      date: "Feb 12, 15:30",
    },
    destination: {
      name: "AAST",
      date: "Feb 12, 16:40",
    },
    price: 15,
  },
  {
    _id: 5,
    origin: {
      name: "Bakos",
      date: "Feb 12, 15:30",
    },
    destination: {
      name: "AAST",
      date: "Feb 12, 16:40",
    },
    price: 15,
  },
  {
    _id: 4,
    origin: {
      name: "Bakos",
      date: "Feb 12, 15:30",
    },
    destination: {
      name: "AAST",
      date: "Feb 12, 16:40",
    },
    price: 30,
  },
];

export default function App() {
  return (
    <SafeAreaProvider>
      {/* <SafeAreaView style={styles.container}>
        <FlatList
          data={bookingHistoryData}
          renderItem={({ item }) => (
            <Bookingcard
              origin={item.origin}
              destination={item.destination}
              price={item.price}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView> */}
      <MapComponent />
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
