import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Bookingcard from "../components/BookingCard";
import { Button } from "@rneui/themed";
import Constants from "expo-constants";
import axios from "axios";
import date from "date-and-time";
import { setDestinationCoords } from "../store/slices/mapSlice";
import { useDispatch } from "react-redux";

const BookingScreen = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const { manifest } = Constants;

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(
        `http://${manifest.debuggerHost
          .split(":")
          .shift()}:4000/getCurrentBooking`
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.booking.length == 0) {
          setCurrentBooking(null);
        }
        setCurrentBooking({
          origin: {
            name: response.data.booking[0].origin,
            date: date.format(
              new Date(response.data.booking[0].reservationDate),
              "MMM DD, hh:mm A"
            ),
            // date: "aas",
          },
          destination: {
            name: response.data.booking[0].destination,
            date: "",
          },
          price: response.data.booking[0].parkingSpaceId.price,
        });
      })
      .catch((error) => {
        // Alert.alert(error.response.data.message);
        console.log(error);
      });
  }, []);

  const cancelBookingHandler = () => {
    axios
      .post(
        `http://${manifest.debuggerHost.split(":").shift()}:4000/cancelBooking`
      )
      .then((response) => {
        if (!response.data.error) {
          Alert.alert(response.data.message);
          dispatch(setDestinationCoords(null));
          setCurrentBooking(null);
        } else {
          Alert.alert(response.data.message);
        }
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      });
  };

  return (
    <View style={styles.container}>
      {currentBooking && (
        <>
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
              Alert.alert(
                "Cancel Booking",
                "You are about to cancel your booking.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "Confirm", onPress: () => cancelBookingHandler() },
                ]
              );
            }}
          />
        </>
      )}
      {!currentBooking && (
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ margin: 50, fontSize: 20, color: "#aaa" }}>
            No Booking
          </Text>
        </View>
      )}
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
