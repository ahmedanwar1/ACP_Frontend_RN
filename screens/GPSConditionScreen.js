import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@rneui/themed";

const GPSConditionScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Please turn on the GPS.</Text>
    </SafeAreaView>
  );
};

export default GPSConditionScreen;

const styles = StyleSheet.create({});
