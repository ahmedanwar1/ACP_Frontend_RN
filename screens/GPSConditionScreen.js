import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const GPSConditionScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // position: "absolute",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        // zIndex: 10,
        // backgroundColor: "#eee",
      }}
    >
      <Text>Please turn on the GPS.</Text>
    </SafeAreaView>
  );
};

export default GPSConditionScreen;

const styles = StyleSheet.create({});
