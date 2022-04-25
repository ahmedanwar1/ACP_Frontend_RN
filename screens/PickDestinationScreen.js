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
    CheckIfLocationEnabled();
  }, []);

  let checkGPS;

  // useEffect(() => {
  //   if (GPSEnabled) {
  //     clearInterval(checkGPS);
  //   }
  // }, [GPSEnabled]);
  checkGPS = setInterval(() => {
    Location.hasServicesEnabledAsync().then((res) => {
      if (res) {
        clearInterval(checkGPS);
        setGPSEnabled(true);
      }
    });
    console.log("sdkmd", GPSEnabled, currentCoords);
    // CheckIfLocationEnabled();
  }, 5000);

  useEffect(() => {
    console.log(currentCoords);
  }, [currentCoords]);

  const CheckIfLocationEnabled = async () => {
    try {
      let enabled = await Location.hasServicesEnabledAsync();

      if (!enabled) {
        // Alert.alert(
        //   "Location Service not enabled",
        //   "Please enable your location services to continue",
        //   [{ text: "OK" }],
        //   { cancelable: false }
        // );
      } else {
        setGPSEnabled(true);
        // console.log(GPSEnabled);
        GetCurrentLocation();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // Alert.alert(
        //   "Permission not granted",
        //   "Allow the app to use location service.",
        //   [{ text: "OK" }],
        //   { cancelable: false }
        // );
      } else {
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
          onPress={CheckIfLocationEnabled}
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
