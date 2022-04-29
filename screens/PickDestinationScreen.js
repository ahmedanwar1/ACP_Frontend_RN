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

const PickDestinationScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // return (<MapComponent currentCoords={currentCoords} />);
  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/images/location-pin.png")}
          style={{
            width: 55,
            height: 50,
            zIndex: 8,
            // position: "absolute",
            // zIndex: 5,
            // top: "50%",
            // left: "50%",
            // transform: [{ translateX: -28 }, { translateY: -50 }],
            transform: [{ translateY: -25.5 }],
          }}
        />
      </View>

      <MapComponent showGPSButton={true}></MapComponent>

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
          // setDestination(region);
          navigation.navigate("DisplayParkingSpacesScreen");
        }}
      />
    </View>
  );
};

export default PickDestinationScreen;

const styles = StyleSheet.create({});
