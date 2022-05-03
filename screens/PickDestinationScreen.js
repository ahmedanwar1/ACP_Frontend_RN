import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@rneui/themed";
import MapComponent from "../components/MapComponent";
import BottomSheet from "@gorhom/bottom-sheet";

const PickDestinationScreen = ({ navigation }) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetRef = useRef(null); //bottom sheet ref

  const snapPoints = ["85%"];

  const bottomSheetHandler = () => {
    setShowBottomSheet(true);
    bottomSheetRef.current?.snapToIndex(0);
  };

  // callbacks
  const handleSheetChanges = useCallback((index = 0) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      {!showBottomSheet && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/location-pin.png")}
            style={{
              width: 55,
              height: 50,
              zIndex: 8,
              position: "relative",
              transform: [{ translateY: -25.5 }],
            }}
          />
        </View>
      )}
      <MapComponent showGPSButton={true}></MapComponent>
      <Button
        title={"Pick a parking space".toUpperCase()}
        buttonStyle={{
          backgroundColor: "#39B66A",
          marginBottom: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          paddingVertical: 10,
        }}
        onPress={() => {
          // navigation.navigate("DisplayParkingSpacesScreen");
          bottomSheetHandler();
        }}
      />
      {showBottomSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={() => {}}
          enablePanDownToClose={true}
          style={{
            flex: 1,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            overflow: "hidden",
          }}
          onClose={() => setShowBottomSheet(false)}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "#000" }}>
                Insert parking details
              </Text>
            </View>
            <Button
              title={"Search"}
              buttonStyle={{
                backgroundColor: "#39B66A",
                marginBottom: 20,
                marginHorizontal: 20,
                borderRadius: 10,
                paddingVertical: 10,
              }}
              onPress={() => {
                navigation.navigate("DisplayParkingSpacesScreen");
              }}
            />
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default PickDestinationScreen;

const styles = StyleSheet.create({});
