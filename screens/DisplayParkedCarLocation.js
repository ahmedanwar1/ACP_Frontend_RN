import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@rneui/themed";
import {
  selectCurrentCoords,
  selectParkedCarLocation,
  setDestinationCoords,
  setParkedCarLocation,
} from "../store/slices/mapSlice";
import BookingCard from "../components/BookingCard";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import axios from "axios";

const DisplayParkedCarLocation = ({ navigation, route }) => {
  let currentCoords = useSelector(selectCurrentCoords); //users current location
  const dispatch = useDispatch();

  // const [carLocation, setCarLocation] = useState({}); //parked car location

  //fetch car's location
  useEffect(() => {}, []);

  // const { carLocation } = route.params; //get destination of the user
  const carLocation = useSelector(selectParkedCarLocation);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation]
  );

  const stripe = useStripe();

  const { manifest } = Constants;

  const paymentHandler = async () => {
    try {
      // sending request
      const response = await axios.post(
        `http://${manifest.debuggerHost.split(":").shift()}:4000/pay`
      );
      const data = await response.data;
      console.log(data);
      const amount = data.amountOfMoney;

      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        style: "alwaysLight",
        merchantDisplayName: "ACP",
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      // if (presentSheet.error) return Alert.alert("presentSheet.error.message");
      if (!presentSheet.error) {
        console.log(presentSheet);
        const responseTransaction = await axios.post(
          `http://${manifest.debuggerHost
            .split(":")
            .shift()}:4000/paymentConfirmed`,
          { amount }
        );
        const transactionResult = await responseTransaction.data;
        if (transactionResult.confirmed) {
          //!
          dispatch(setDestinationCoords(null));
          dispatch(setParkedCarLocation(null));
          Alert.alert("Payment complete, thank you!");
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };

  return (
    <StripeProvider publishableKey={process.env.STRIPE_PUBLIC_KEY}>
      <View
        style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}
      >
        <MapComponent parkedCarLocation={carLocation}>
          <Marker
            coordinate={{
              latitude: carLocation.latitude,
              longitude: carLocation.longitude,
            }}
          >
            <Image
              source={require("../assets/images/car.png")}
              style={{ height: 40, width: 40 }}
            />
          </Marker>
        </MapComponent>
        <Button
          title={"Pay"}
          buttonStyle={{
            backgroundColor: "#39B66A",
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            paddingVertical: 10,
          }}
          onPress={() => {
            paymentHandler();
          }}
        />
      </View>
    </StripeProvider>
  );
};

export default DisplayParkedCarLocation;

const styles = StyleSheet.create({});
