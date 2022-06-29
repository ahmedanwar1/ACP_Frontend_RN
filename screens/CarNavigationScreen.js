import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentCoords,
  selectDestinationCoords,
  setParkedCarLocation,
  setRemainingTimeToArrive,
} from "../store/slices/mapSlice";
import { Button } from "@rneui/themed";
import AbortController from "abort-controller";
import axios from "axios";
import Constants from "expo-constants";
import { selectUserInfo } from "../store/slices/userSlice";

const CarNavigationScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  let currentCoords = useSelector(selectCurrentCoords); //get user's current coords
  // const { destinationCoords } = route.params; //get destination of the user
  const destinationCoords = useSelector(selectDestinationCoords);

  const userInfo = useSelector(selectUserInfo);

  //set array of directions coords for navigation
  const [multiPolyline, setMultiPolyline] = useState([]);
  const [distance, setDistance] = useState(0);
  // const [openBarrier, setOpenBarrier] = useState(false);
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
    const abortController = new AbortController();
    try {
      if (destinationCoords) {
        console.log();
        axios
          .get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${currentCoords.longitude}, ${currentCoords.latitude};${destinationCoords[1]},${destinationCoords[0]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
            {
              signal: abortController.signal,
            }
          )
          .then((res) => {
            console.log(res.data);
            const coordinates = res.data.routes[0].geometry.coordinates;
            dispatch(
              setRemainingTimeToArrive(
                Math.ceil(res.data.routes[0].duration / 60)
              )
            );
            setDistance((res.data.routes[0].distance / 1000).toFixed(2));
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
          })
          .catch((e) => console.log(e));
      }
    } catch (error) {
      console.log(error);
    }
    return () => abortController.abort();
  }, [currentCoords]);

  const { manifest } = Constants;

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      <View
        style={{
          position: "absolute",
          top: 15,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 8,
          backgroundColor: "#fff",
          right: 0,
          padding: 10,
          borderRadius: 7,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        }}
      >
        <Text style={{ color: "#39B66A", fontWeight: "700", fontSize: 16 }}>
          {distance} Km
        </Text>
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
          // setOpenBarrier(true);
          // navigation.navigate("DisplayParkedCarLocation", {
          //   carLocation: {
          //     longitude: destinationCoords[1],
          //     latitude: destinationCoords[0],
          //   },
          // });

          axios
            .post(
              `http://${manifest.debuggerHost
                .split(":")
                .shift()}:4000/openBarrier`
            )
            .then((response) => {
              console.log(response.data);
              if (!response.data.error) {
                dispatch(
                  setParkedCarLocation({
                    longitude: destinationCoords[1],
                    latitude: destinationCoords[0],
                  })
                );
              }
            })
            .catch((error) => console.log(error));
        }}
      />
    </View>
  );
};

export default CarNavigationScreen;

const styles = StyleSheet.create({});
