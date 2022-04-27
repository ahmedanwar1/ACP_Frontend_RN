import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "@rneui/themed";

import {
  checkIfLocationEnabled,
  getCurrentLocation,
  selectCurrentCoords,
} from "../store/slices/mapSlice";
import { useDispatch, useSelector } from "react-redux";

const MapComponent = ({ children }) => {
  const dispatch = useDispatch();
  let currentCoords = useSelector(selectCurrentCoords);

  const [region, setRegion] = useState({
    latitude: 31.227184,
    longitude: 29.971294,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  let _mapView;

  const onRegionChangeHandler = (e) => {
    setRegion(e);
  };

  const ChangeRegionToCurrentLocationHandler = () => {
    console.log(currentCoords);
    if (currentCoords) {
      _mapView.animateCamera(
        {
          center: {
            latitude: currentCoords.latitude,
            longitude: currentCoords.longitude,
          },
          pitch: 0,
          altitude: 5,
          zoom: 15,
        },
        { duration: 2000 }
      );
    }
  };

  useEffect(() => {
    (async () => {
      await dispatch(checkIfLocationEnabled());
      dispatch(getCurrentLocation());
    })();
  }, []);

  return (
    <>
      <MapView
        // provider="mapbox"
        // customMapStyle={{}}
        ref={(mapView) => {
          _mapView = mapView;
        }}
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
        followUserLocation
        // showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        // compassOffset={{ x: 80, y: 150 }}
        // zoomControlEnabled
      >
        {children}
      </MapView>
      <TouchableOpacity
        style={{ position: "absolute", bottom: 80, right: 10 }}
        onPress={() => {
          ChangeRegionToCurrentLocationHandler();
        }}
      >
        <Icon
          raised
          name="locate"
          type="ionicon"
          color="#000"
          style={{
            backgroundColor: "#fff",
            zIndex: 8,
            // position: "absolute",
            // bottom: 5,
            // justifyContent: "center",
            // alignItems: "center",
          }}
          size={28}
        />
      </TouchableOpacity>
    </>
    // </View>
  );
};

const styles = StyleSheet.create({});

export default MapComponent;
