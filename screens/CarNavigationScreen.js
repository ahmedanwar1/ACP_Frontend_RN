import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentCoords } from "../store/slices/mapSlice";

const CarNavigationScreen = ({ route, navigation }) => {
  let currentCoords = useSelector(selectCurrentCoords);
  const { destinationCoords } = route.params;

  // const [destination, setDestination] = useState(null);
  const [multiPolyline, setMultiPolyline] = useState([]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // // Prompt the user before leaving the screen
        // Alert.alert(
        //   'Discard changes?',
        //   'You have unsaved changes. Are you sure to discard them and leave the screen?',
        //   [
        //     { text: "Don't leave", style: 'cancel', onPress: () => {} },
        //     {
        //       text: 'Discard',
        //       style: 'destructive',
        //       // If the user confirmed, then we dispatch the action we blocked earlier
        //       // This will continue the action that had triggered the removal of the screen
        //       onPress: () => navigation.dispatch(e.data.action),
        //     },
        //   ]
        // );
      }),
    [navigation]
  );

  useEffect(() => {
    if (destinationCoords) {
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentCoords.longitude}, ${currentCoords.latitude};${destinationCoords[1]},${destinationCoords[0]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
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
      <MapComponent>
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
      </MapComponent>
    </View>
  );
};

export default CarNavigationScreen;

const styles = StyleSheet.create({});
