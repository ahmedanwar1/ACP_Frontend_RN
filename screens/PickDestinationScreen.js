import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@rneui/themed";
import MapComponent from "../components/MapComponent";
import InputField from "../components/InputField";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomSheet from "@gorhom/bottom-sheet";

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

  const [date, setDate] = useState(new Date());
  const [parkingDate, setParkingDate] = useState();
  const [parkingTime, setParkingTime] = useState();
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (mode == "time") {
        setParkingTime(
          `${selectedDate.getHours()}:${selectedDate.getMinutes()}`
        );
      } else if (mode == "date") {
        setParkingDate(
          `${selectedDate.getDate()}/${
            selectedDate.getMonth() + 1
          }/${selectedDate.getFullYear()}`
        );
      }
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
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
                value={date}
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
                navigation.navigate("DisplayParkingSpacesScreen");
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
