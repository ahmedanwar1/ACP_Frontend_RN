import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";

import {
  checkIfLocationEnabled,
  getCurrentLocation,
} from "../store/slices/mapSlice";
import { useDispatch } from "react-redux";

const MapComponent = ({ currentCoords, children }) => {
  const dispatch = useDispatch();

  const [region, setRegion] = useState({
    latitude: 31.227184,
    longitude: 29.971294,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [destination, setDestination] = useState(null);

  const onRegionChangeHandler = (e) => {
    setRegion(e);
  };

  useEffect(() => {
    // const enableGPSAndPermission = async () => {
    //   const enabled = await checkIfLocationEnabled();
    //   if (enabled) {
    //     getCurrentLocation();
    //   }
    // };

    // enableGPSAndPermission();
    (async () => {
      await dispatch(checkIfLocationEnabled());
      dispatch(getCurrentLocation());
    })();
  }, []);

  // //check frequently that GPS is enabled
  // let checkGPS;
  // checkGPS = setInterval(() => {
  //   checkIfLocationEnabled().then((enabled) => {
  //     if (enabled) {
  //       // clearInterval(checkGPS);
  //       dispatch(setGPSEnabled(true));
  //     } else {
  //       dispatch(setGPSEnabled(false));
  //     }
  //   });
  //   console.log("GPS: ", GPSEnabled, currentCoords);
  // }, 7000);

  return (
    <MapView
      // provider="mapbox"
      // customMapStyle={{}}
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      initialRegion={region}
      userInterfaceStyle="dark"
      // onRegionChange={onRegionChangeHandler}
      onRegionChangeComplete={onRegionChangeHandler}
      showsUserLocation
      // zoomControlEnabled
    >
      {children}
    </MapView>
  );
};

const styles = StyleSheet.create({});

export default MapComponent;
