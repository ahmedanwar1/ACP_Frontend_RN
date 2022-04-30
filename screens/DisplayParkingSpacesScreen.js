import { StyleSheet, Text, View, Image } from "react-native";
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

const DisplayParkingSpacesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  let currentCoords = useSelector(selectCurrentCoords); //users current location

  const [parkingSpaces, setParkingSpaces] = useState([
    {
      _id: "6230e4050551177b1192d7cd",
      location: {
        type: "Point",
        coordinates: [31.308337, 30.060701],
      },
      price: 15,
    },
    {
      _id: "6230e4050551177b1192d8cd",
      location: {
        type: "Point",
        coordinates: [31.309337, 30.060701],
      },
      price: 15,
    },
    {
      _id: "6230e4050551177b1192d9cd",
      location: {
        type: "Point",
        coordinates: [31.308337, 30.060401],
      },
      price: 15,
    },
  ]);
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

  // //calculate the expected arrival date
  // const calculateArrivalDate = (sec) => {
  //   let timeObject = new Date();
  //   timeObject = new Date(timeObject.getTime() + sec * 1000);
  //   return timeObject;
  // };

  // //convert date into (dd/mm/yyyy h:i:s) format
  // const convertDateToFormat = (date) => {
  //   return `${date.getDate()}/${
  //     date.getMonth() + 1
  //   }/${date.getFullYear()} ${date.getMonth()}:${date.getHours()}:${date.getSeconds()}`;
  // };

  //fetch parking spaces (recieve destination, time, date .... )
  useEffect(() => {}, []);

  //fetch time from matrixAPI
  useEffect(() => {
    const abortController = new AbortController();
    if (selectedSpace) {
      try {
        fetch(
          `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${currentCoords.longitude},${currentCoords.latitude};${selectedSpace.location.coordinates[1]},${selectedSpace.location.coordinates[0]}?sources=0&destinations=1&access_token=${MAPBOX_ACCESS_TOKEN}`,
          {
            signal: abortController.signal,
          }
        )
          .then((result) => result.json())
          .then((res) => {
            console.log(res);
            setSpaceDetails(res);
          })
          .catch((e) => console.log(e));
      } catch (error) {
        console.log(error);
      }
    }
    return () => abortController.abort();
  }, [selectedSpace]);

  return (
    <View style={{ flex: 1, position: "relative", justifyContent: "flex-end" }}>
      <MapComponent showGPSButton={false} parkingSpaces={parkingSpaces}>
        {parkingSpaces.length > 0 &&
          parkingSpaces.map((space) => {
            return (
              <Marker
                key={space._id}
                coordinate={{
                  latitude: space.location.coordinates[0],
                  longitude: space.location.coordinates[1],
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
          style={{ flex: 1 }}
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
                {/* <Text
                  style={{
                    fontSize: 17,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Expected Travel Time:{" "}
                  {Math.floor(spaceDetails.durations[0][0] / 60)} mins
                </Text> */}
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
              onPress={() => {
                // //setDestination(region);
                // navigation.navigate("CarNavigationScreen", {
                //   destinationCoords: selectedSpace.location.coordinates,
                // });
                dispatch(
                  setDestinationCoords(selectedSpace.location.coordinates)
                );
              }}
            />
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default DisplayParkingSpacesScreen;

const styles = StyleSheet.create({});
