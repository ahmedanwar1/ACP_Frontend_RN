import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";

import {
  checkIfLocationEnabled,
  getCurrentLocation,
} from "../store/slices/mapSlice";
import { useDispatch } from "react-redux";

const LocationPermissionFailedScreen = () => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Please enable the location Service.</Text>
      <Button
        title="Turn on"
        onPress={() => dispatch(getCurrentLocation())}
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
};

export default LocationPermissionFailedScreen;

const styles = StyleSheet.create({});
