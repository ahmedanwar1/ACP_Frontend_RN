import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Bookingcard from "../components/BookingCard";
import { Button } from "@rneui/themed";

const currentBooking = {
  _id: 1,
  origin: {
    name: "Bakos",
    date: "Feb 12, 15:30",
  },
  destination: {
    name: "Abou Qir",
    date: "Feb 12, 16:40",
  },
  price: 15,
};

const BookingScreen = () => {
  return (
    <View style={styles.container}>
      <Bookingcard
        origin={currentBooking.origin}
        destination={currentBooking.destination}
        price={currentBooking.price}
      />
      <Button
        title="Cancel booking"
        buttonStyle={{
          backgroundColor: "#db0916",
          marginBottom: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          paddingVertical: 10,
          // flexGrow: 1,
          // width: 100,
        }}
        onPress={() => {
          // Alert.alert("hi");
        }}
      />
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
});
