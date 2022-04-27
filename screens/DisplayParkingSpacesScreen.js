import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";

const DisplayParkingSpacesScreen = () => {
  const [parkingSpaces, setParkingSpaces] = useState([
    {
      _id: "6230e4050551177b1192d7cd",
      location: {
        type: "Point",
        coordinates: [31.22496, 29.971869],
      },
    },
    {
      _id: "6230e4050551177b1192d8cd",
      location: {
        type: "Point",
        coordinates: [31.22298, 29.971669],
      },
    },
    {
      _id: "6230e4050551177b1192d9cd",
      location: {
        type: "Point",
        coordinates: [31.22793, 29.971669],
      },
    },
  ]);

  //fetch parking spaces (recieve destination, time, date .... )
  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      <MapComponent showGPSButton={false}>
        {parkingSpaces.length > 0 &&
          parkingSpaces.map((space) => {
            return (
              <Marker
                key={space._id}
                coordinate={{
                  latitude: space.location.coordinates[0],
                  longitude: space.location.coordinates[1],
                }}
                onPress={() => console.log(space._id)}
              >
                <Image
                  source={require("../assets/images/rec.png")}
                  style={{ height: 35, width: 35 }}
                />
              </Marker>
            );
          })}
      </MapComponent>
    </View>
  );
};

export default DisplayParkingSpacesScreen;

const styles = StyleSheet.create({});
