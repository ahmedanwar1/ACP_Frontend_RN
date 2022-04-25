import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";

import * as Location from "expo-location";

const MapComponent = ({ currentCoords }) => {
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
  //*** */
  const [multiPolyline, setMultiPolyline] = useState([]);

  useEffect(() => {
    if (destination) {
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentCoords.longitude}, ${currentCoords.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=pk.eyJ1IjoiYWhtZWRhbndhcjEiLCJhIjoiY2wwbTVwd3JuMDAyNDNqcm1xcHoybnRidCJ9.Jcl0bu1PSeBlNzUJDnZxrw`
      )
        .then((result) => result.json())
        .then((res) => {
          console.log(res);
          const coordinates = res.routes[0].geometry.coordinates;
          const updatedCoordinates = [];
          // multiPolyline = [];
          for (let i = 0; i < coordinates.length; i++) {
            updatedCoordinates.push({
              latitude: coordinates[i][1],
              longitude: coordinates[i][0],
            });
          }
          setMultiPolyline(updatedCoordinates);
          console.log(multiPolyline);
        });
    }
  }, [currentCoords]);

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      {multiPolyline.length == 0 && (
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
      )}
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
        {/* <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          draggable
        >
          <Image
            source={require("../assets/images/location-pin.png")}
            style={{ width: 20, height: 30 }}
          />
        </Marker> */}
        {multiPolyline && (
          <Polyline
            coordinates={multiPolyline}
            strokeColor="#7f9900" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              "#7F0000",
              "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
              "#B24112",
              "#E5845C",
              "#238C23",
              "#7F0000",
            ]}
            strokeWidth={6}
          />
        )}
      </MapView>
      {multiPolyline.length == 0 && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default MapComponent;
