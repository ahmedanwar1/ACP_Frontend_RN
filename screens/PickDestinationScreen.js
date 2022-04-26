import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@rneui/themed";

import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import MapComponent from "../components/MapComponent";

// import GPSConditionScreen from "../components/GPSConditionScreen";
// import LocationPermissionFailedScreen from "../components/LocationPermissionFailedScreen";

import { useSelector, useDispatch } from "react-redux";
import {
  setGPSEnabled,
  setCurrentCoords,
  selectCurrentCoords,
  selectGPSEnabled,
  checkIfLocationEnabled,
  getCurrentLocation,
} from "../store/slices/mapSlice";

const PickDestinationScreen = () => {
  const dispatch = useDispatch();

  // return (<MapComponent currentCoords={currentCoords} />);
  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      <Image
        source={require("../assets/images/location-pin.png")}
        style={{
          width: 55,
          height: 50,
          position: "absolute",
          zIndex: 5,
          top: "50%",
          left: "50%",
          transform: [{ translateX: -28 }, { translateY: -50 }],
        }}
      />

      <MapComponent></MapComponent>

      <Button
        title={"Pick a parking space".toUpperCase()}
        buttonStyle={{
          backgroundColor: "#39B66A",
          marginBottom: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          paddingVertical: 10,
        }}
        onPress={() => {
          setDestination(region);
        }}
      />
    </View>
  );
};

export default PickDestinationScreen;

const styles = StyleSheet.create({});
