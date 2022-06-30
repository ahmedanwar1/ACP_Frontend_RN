import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@rneui/themed";
import MapComponent from "../components/MapComponent";
import InputField from "../components/InputField";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomSheet from "@gorhom/bottom-sheet";
import date from "date-and-time";
import { useSelector } from "react-redux";
import { selectCurrentCoords } from "../store/slices/mapSlice";
import axios from "axios";
import Constants from "expo-constants";
import { Alert } from "react-native";

const PickDestinationScreen = ({ navigation }) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetRef = useRef(null); //bottom sheet ref

  const snapPoints = ["45%"];

  const bottomSheetHandler = () => {
    setShowBottomSheet(true);
    bottomSheetRef.current?.snapToIndex(0);
  };

  // callbacks
  const handleSheetChanges = useCallback((index = 0) => {
    console.log("handleSheetChanges", index);
  }, []);

  let currentCoords = useSelector(selectCurrentCoords); //get current coords of user

  const [myDate, setDate] = useState(new Date());
  const [parkingDate, setParkingDate] = useState();
  const [parkingTime, setParkingTime] = useState();
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: currentCoords ? currentCoords.latitude : 30,
    longitude: currentCoords ? currentCoords.longitude : 31,
  });

  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (mode == "time") {
        // `${date.format(new Date(), "MMM DD, hh:mm A")}`
        setParkingTime(`${date.format(selectedDate, "hh:mm A")}`);
      } else if (mode == "date") {
        setParkingDate(`${date.format(selectedDate, "DD/MM/YYYY")}`);
      }
      // setDate(selectedDate);
      console.log(selectedDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const { manifest } = Constants;

  const searchHandler = () => {
    if (!parkingDate || !parkingTime) {
      return Alert.alert("Date not provided!");
    }
    axios
      .get(
        `http://${manifest.debuggerHost
          .split(":")
          .shift()}:4000/getNearParkingSpaces?longitude=${
          selectedCoords.longitude
        }&latitude=${selectedCoords.latitude}`
      )
      .then((response) => {
        console.log(response.data);
        console.log(
          `http://${manifest.debuggerHost
            .split(":")
            .shift()}:4000/getNearParkingSpaces?longitude=${
            selectedCoords.longitude
          }&latitude=${selectedCoords.latitude}`
        );
        if (parkingDate && parkingTime && !response.data.error) {
          navigation.navigate("DisplayParkingSpacesScreen", {
            parkingData: response.data,
            SelectedDate: myDate,
          });
        } else {
          Alert.alert(response.data.message);
        }
      })
      .catch((error) => {
        // handle error
        Alert.alert(error.response.data.message);
      });
  };

  return (
    <>
      <View
        style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}
      >
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
        <MapComponent
          showGPSButton={true}
          enableInteraction={!showBottomSheet}
          setSelectedCoords={setSelectedCoords}
        ></MapComponent>
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
      </View>
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
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              marginHorizontal: 20,
            }}
          >
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
            <View style={{}}>
              <Text style={styles.pickerHeader}>Date</Text>
              <InputField
                icon="calendar"
                placeholder="ex. 1/1/2022"
                onPress={() => showMode("date")}
                text={parkingDate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pickerHeader}>Time</Text>
              <InputField
                icon="clock"
                placeholder="ex. 7:00"
                onPress={() => showMode("time")}
                text={parkingTime}
              />
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={myDate}
                mode={mode}
                is24Hour={false}
                onChange={onChangeDate}
              />
            )}
            <Button
              title={"Search"}
              buttonStyle={{
                backgroundColor: "#39B66A",
                marginBottom: 20,

                borderRadius: 10,
                paddingVertical: 10,
              }}
              onPress={() => {
                searchHandler();
              }}
            />
          </View>
        </BottomSheet>
      )}
    </>
  );
};

export default PickDestinationScreen;

const styles = StyleSheet.create({
  pickerHeader: { fontSize: 16, marginVertical: 10, color: "#333" },
});
