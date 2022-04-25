import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Bookingcard from "../components/BookingCard";
import { SafeAreaView } from "react-native-safe-area-context";

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

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
