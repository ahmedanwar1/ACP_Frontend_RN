import { StyleSheet, Text, View, Image } from "react-native";
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
import { selectCurrentCoords } from "../store/slices/mapSlice";
import BookingCard from "../components/BookingCard";

const DisplayParkedCarLocation = ({ navigation, route }) => {
  let currentCoords = useSelector(selectCurrentCoords); //users current location
  const dispatch = useDispatch();

  // const [carLocation, setCarLocation] = useState({}); //parked car location

  //fetch car's location
  useEffect(() => {}, []);

  const { carLocation } = route.params; //get destination of the user

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation]
  );

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
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
    </View>
  );
};

export default DisplayParkedCarLocation;

const styles = StyleSheet.create({});
