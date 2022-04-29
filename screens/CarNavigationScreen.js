import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentCoords,
  setRemainingTimeToArrive,
} from "../store/slices/mapSlice";
import { Button } from "@rneui/themed";
import { StackActions } from "@react-navigation/native";

const CarNavigationScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  let currentCoords = useSelector(selectCurrentCoords); //get user's current coords
  const { destinationCoords } = route.params; //get destination of the user

  //set array of directions coords for navigation
  const [multiPolyline, setMultiPolyline] = useState([]);
  const [openBarrier, setOpenBarrier] = useState(false);
  //expected remaining time to arrive
  // const [remainingTime, setRemainingTime] = useState(null);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation]
  );

  //fetch directions from MABOX DIRECTIONS API whenever users location changes
  useEffect(() => {
    if (destinationCoords && !openBarrier) {
      console.log();
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentCoords.longitude}, ${currentCoords.latitude};${destinationCoords[1]},${destinationCoords[0]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      )
        .then((result) => result.json())
        .then((res) => {
          console.log(res);
          const coordinates = res.routes[0].geometry.coordinates;
          dispatch(
            setRemainingTimeToArrive(Math.ceil(res.routes[0].duration / 60))
          );
          const updatedCoordinates = [];
          //construct the recieved polylines (direction) array
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
      <View
        style={{
          position: "absolute",
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 8,
          backgroundColor: "#39B66A",
        }}
      >
        {/* <Text style={{ color: "#fff", fontWeight: "500" }}>
          Arrive in {remainingTime} mins
        </Text> */}
      </View>
      <MapComponent carNavigation={true}>
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
      <Button
        title={"Unlock parking barrier".toUpperCase()}
        buttonStyle={{
          backgroundColor: "#39B66A",
          marginBottom: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          paddingVertical: 10,
        }}
        onPress={() => {
          // setDestination(region);
          // navigation.dispatch(
          //   StackActions.replace("DisplayParkedCarLocation", {
          //     carLocation: {
          //       longitude: destinationCoords[0],
          //       latitude: destinationCoords[1],
          //     },
          //   })
          // );
          setOpenBarrier(true);
          navigation.navigate("DisplayParkedCarLocation", {
            carLocation: {
              longitude: destinationCoords[1],
              latitude: destinationCoords[0],
            },
          });
        }}
      />
    </View>
  );
};

export default CarNavigationScreen;

const styles = StyleSheet.create({});
