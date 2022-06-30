import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Bookingcard from "../components/BookingCard";
import axios from "axios";
import Constants from "expo-constants";
import date from "date-and-time";

// const bookingHistoryData = [
//   {
//     _id: 1,
//     origin: {
//       name: "Bakos",
//       date: "Feb 12, 15:30",
//     },
//     destination: {
//       name: "El Montaza",
//       date: "Feb 12, 16:40",
//     },
//     price: 15,
//   },
//   {
//     _id: 2,
//     origin: {
//       name: "Bakos",
//       date: "Feb 12, 15:30",
//     },
//     destination: {
//       name: "El Montaza",
//       date: "Feb 12, 16:40",
//     },
//     price: 15,
//   },
//   {
//     _id: 3,
//     origin: {
//       name: "Bakos",
//       date: "Feb 12, 15:30",
//     },
//     destination: {
//       name: "El Montaza",
//       date: "Feb 12, 16:40",
//     },
//     price: 15,
//   },
//   {
//     _id: 6,
//     origin: {
//       name: "Bakos",
//       date: "Feb 12, 15:30",
//     },
//     destination: {
//       name: "El Montaza",
//       date: "Feb 12, 16:40",
//     },
//     price: 15,
//   },
//   {
//     _id: 5,
//     origin: {
//       name: "Bakos",
//       date: "Feb 12, 15:30",
//     },
//     destination: {
//       name: "El Montaza",
//       date: "Feb 12, 16:40",
//     },
//     price: 15,
//   },
//   {
//     _id: 4,
//     origin: {
//       name: "Bakos",
//       date: "Feb 12, 15:30",
//     },
//     destination: {
//       name: "El Montaza",
//       date: "Feb 12, 16:40",
//     },
//     price: 30,
//   },
// ];

const HistoryScreen = () => {
  const [bookingHistoryData, setBookingHistoryData] = useState([]);
  const { manifest } = Constants;

  useEffect(() => {
    axios
      .get(`http://${manifest.debuggerHost.split(":").shift()}:4000/allBooking`)
      .then((response) => {
        console.log(response.data);
        if (response.data.booking.length == 0) {
          setBookingHistoryData([]);
        }
        const generatedHistoryData = response.data.booking.map((item) => {
          return {
            _id: item.booking._id,
            origin: {
              name: item.booking.origin,
              date: date.format(
                new Date(item.booking.createdAt),
                "MMM DD, hh:mm A"
              ),
              // date: "aas",
            },
            destination: {
              name: item.booking.destination,
              date: date.format(new Date(item.leavingTime), "MMM DD, hh:mm A"),
            },
            price: item.totalPrice,
          };
        });
        setBookingHistoryData(generatedHistoryData);
        // setBookingHistoryData({
        //   origin: {
        //     name: response.data.booking[0].origin,
        //     date: date.format(
        //       new Date(response.data.booking[0].reservationDate),
        //       "MMM DD, hh:mm A"
        //     ),
        //     // date: "aas",
        //   },
        //   destination: {
        //     name: response.data.booking[0].destination,
        //     date: "",
        //   },
        //   price: response.data.booking[0].parkingSpaceId.price,
        // });
      })
      .catch((error) => {
        // Alert.alert(error.response.data.message);
        console.log(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {bookingHistoryData.length > 0 && (
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
      )}
      {bookingHistoryData.length == 0 && (
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ margin: 50, fontSize: 20, color: "#aaa" }}>
            No Booking
          </Text>
        </View>
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
