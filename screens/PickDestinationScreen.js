import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@rneui/themed";

import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import MapComponent from "../components/MapComponent";

let foregroundSubscription = null;

const PickDestinationScreen = () => {
  const [GPSEnabled, setGPSEnabled] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);

  useEffect(() => {
    const enableGPSAndPermission = async () => {
      const enabled = await CheckIfLocationEnabled();
      if (enabled) {
        GetCurrentLocation();
      }
    };

    enableGPSAndPermission();
  }, []);

  //check frequently that GPS is enabled
  let checkGPS;
  checkGPS = setInterval(() => {
    CheckIfLocationEnabled().then((enabled) => {
      if (enabled) {
        // clearInterval(checkGPS);
        setGPSEnabled(true);
      } else {
        setGPSEnabled(false);
      }
    });
    console.log("GPS: ", GPSEnabled, currentCoords);
  }, 7000);

  const CheckIfLocationEnabled = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();

      if (enabled) {
        setGPSEnabled(true);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  const GetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status == "granted") {
        // Make sure that foreground location tracking is not running
        foregroundSubscription?.remove();

        // Start watching position in real-time
        foregroundSubscription = await Location.watchPositionAsync(
          {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
          },
          (location) => {
            setCurrentCoords(location.coords);
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!GPSEnabled) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Please turn on the GPS.</Text>
      </SafeAreaView>
    );
  }
  if (!currentCoords) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Please enable the location Service.</Text>
        <Button
          title="Turn on"
          onPress={GetCurrentLocation}
          buttonStyle={{
            // backgroundColor: "#39B66A",
            width: 300,
            marginTop: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            paddingVertical: 10,
          }}
        />
      </SafeAreaView>
    );
  }

  return <MapComponent currentCoords={currentCoords} />;
};

export default PickDestinationScreen;

const styles = StyleSheet.create({});
