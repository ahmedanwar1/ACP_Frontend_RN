import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import date from "date-and-time";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@rneui/themed";
import {
  selectCurrentCoords,
  setDestinationCoords,
} from "../store/slices/mapSlice";
import BookingCard from "../components/BookingCard";
import AbortController from "abort-controller";
import axios from "axios";
import Constants from "expo-constants";

const DisplayParkingSpacesScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  let currentCoords = useSelector(selectCurrentCoords); //users current location

  const parkingSpaces = route.params.parkingData.data;
  const SelectedDate = route.params.SelectedDate;

  // const [parkingSpaces, setParkingSpaces] = useState([
  //   {
  //     _id: "6230e4050551177b1192d7cd",
  //     location: {
  //       type: "Point",
  //       coordinates: [31.287765, 30.032445],
  //     },
  //     price: 15,
  //   },
  //   {
  //     _id: "6230e4050551177b1192d8cd",
  //     location: {
  //       type: "Point",
  //       coordinates: [31.286756, 30.033346],
  //     },
  //     price: 10,
  //   },
  //   {
  //     _id: "6230e4050551177b1192d9cd",
  //     location: {
  //       type: "Point",
  //       coordinates: [31.289728, 30.029966],
  //     },
  //     price: 25,
  //   },
  // ]);

  // const [parkingSpaces, setParkingSpaces] = useState([
  //   {
  //     _id: "6230e4050551177b1192d7cd",
  //     location: {
  //       type: "Point",
  //       coordinates: [31.308337, 30.060701],
  //     },
  //     price: 15,
  //   },
  //   {
  //     _id: "6230e4050551177b1192d8cd",
  //     location: {
  //       type: "Point",
  //       coordinates: [31.309337, 30.060701],
  //     },
  //     price: 15,
  //   },
  //   {
  //     _id: "6230e4050551177b1192d9cd",
  //     location: {
  //       type: "Point",
  //       coordinates: [31.308337, 30.060401],
  //     },
  //     price: 15,
  //   },
  // ]);
  const [selectedSpace, setSelectedSpace] = useState(null); //the space that was picked (clicked) by user
  const [spaceDetails, setSpaceDetails] = useState(null); //the fetched details of the selected space

  //open bottom sheet when selecting a space
  const SelectSpaceHandler = (space) => {
    setSelectedSpace(space);
    bottomSheetRef.current?.snapToIndex(0);
    console.log(space._id);
  };

  const bottomSheetRef = useRef(null); //bottom sheet ref

  const snapPoints = ["60%"];

  // callbacks
  const handleSheetChanges = useCallback((index = 0) => {
    console.log("handleSheetChanges", index);
  }, []);

  //fetch parking spaces (recieve destination, time, date .... )
  useEffect(() => {}, []);

  //fetch time from matrixAPI
  useEffect(() => {
    const abortController = new AbortController();
    if (selectedSpace) {
      try {
        axios
          .get(
            `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${currentCoords.longitude},${currentCoords.latitude};${selectedSpace.coordinates[1]},${selectedSpace.coordinates[0]}?sources=0&destinations=1&access_token=${MAPBOX_ACCESS_TOKEN}`,
            {
              signal: abortController.signal,
            }
          )
          .then((res) => {
            console.log(res);
            setSpaceDetails(res.data);
          })
          .catch((e) => console.log(e));
      } catch (error) {
        console.log(error);
      }
    }
    return () => abortController.abort();
  }, [selectedSpace]);

  const { manifest } = Constants;

  const countinueToNextScreenHandler = () => {
    axios
      .post(
        `http://${manifest.debuggerHost
          .split(":")
          .shift()}:4000/reserveParkingSpace`,
        {
          date: SelectedDate,
          parkingSpaceId: selectedSpace,
          origin: spaceDetails.sources[0].name || "Unknown",
          destination: spaceDetails.destinations[0].name || "Unknown",
        }
      )
      .then((response, error) => {
        if (!response.error) {
          dispatch(setDestinationCoords(selectedSpace.coordinates));
        } else {
          Alert.alert(response.data.message);
        }
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      });
  };

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      <MapComponent showGPSButton={false} parkingSpaces={parkingSpaces}>
        {parkingSpaces.length > 0 &&
          parkingSpaces.map((space) => {
            return (
              <Marker
                key={space._id}
                coordinate={{
                  latitude: space.coordinates[0],
                  longitude: space.coordinates[1],
                }}
                onPress={() => {
                  SelectSpaceHandler(space);
                }}
                identifier={space._id}
              >
                <Image
                  source={require("../assets/images/rec.png")}
                  style={{ height: 35, width: 35 }}
                />
              </Marker>
            );
          })}
      </MapComponent>
      {selectedSpace && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          style={{
            flex: 1,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "#39B66A" }}>
                Space details
              </Text>
            </View>
            {spaceDetails && spaceDetails.code == "Ok" && (
              <View
                style={{
                  paddingBottom: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BookingCard
                  origin={{
                    name: spaceDetails.sources[0].name || "Unknown",
                    date: `${date.format(new Date(), "MMM DD, hh:mm A")}`,
                  }}
                  destination={{
                    name: spaceDetails.destinations[0].name || "Unknown",
                    // date: new Date().format("m-d-Y h:i:s"),
                    date: `${date.format(
                      date.addSeconds(new Date(), spaceDetails.durations[0][0]),
                      "MMM DD, hh:mm A"
                    )}`,
                  }}
                  price={selectedSpace.price}
                  travelTime={Math.floor(spaceDetails.durations[0][0] / 60)}
                />
              </View>
            )}
            <Button
              title={"Continue"}
              buttonStyle={{
                backgroundColor: "#39B66A",
                marginBottom: 20,
                marginHorizontal: 20,
                borderRadius: 10,
                paddingVertical: 10,
              }}
              onPress={() => countinueToNextScreenHandler()}
            />
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default DisplayParkingSpacesScreen;

const styles = StyleSheet.create({});
