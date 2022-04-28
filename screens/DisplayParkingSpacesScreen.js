import { StyleSheet, Text, View, Image } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import MapComponent from "../components/MapComponent";
import { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@rneui/themed";
import { selectCurrentCoords } from "../store/slices/mapSlice";
import BookingCard from "../components/BookingCard";
/*
https://api.mapbox.com/directions-matrix/v1/mapbox/driving/29.971752,31.227164;30.060701,31.308337?sources=0&destinations=1&access_token=pk.....
*/
const DisplayParkingSpacesScreen = ({ navigation }) => {
  let currentCoords = useSelector(selectCurrentCoords);

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

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaceDetails, setSpaceDetails] = useState(null);

  const SelectSpaceHandler = (space) => {
    setSelectedSpace(space);
    bottomSheetRef.current?.snapToIndex(0);
    console.log(space._id);
  };

  const bottomSheetRef = useRef(null);

  // variables
  // const snapPoints = useMemo(() => ["60%"], []);
  const snapPoints = ["60%"];

  // callbacks
  const handleSheetChanges = useCallback((index = 0) => {
    console.log("handleSheetChanges", index);
    // setSelectedSpace(space);
    // bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const calculateArrivalDate = (sec) => {
    let timeObject = new Date();
    timeObject = new Date(timeObject.getTime() + sec * 1000);
    // console.log(timeObject.toLocaleString());
    // return timeObject.toLocaleString();
    return `${timeObject.getDate()}/${
      timeObject.getMonth() + 1
    }/${timeObject.getFullYear()} ${timeObject.getMonth()}:${timeObject.getHours()}:${timeObject.getSeconds()}`;
  };
  //fetch parking spaces (recieve destination, time, date .... )
  useEffect(() => {}, []);

  //fetch time from matrixAPI
  useEffect(() => {
    const abortController = new AbortController();
    if (selectedSpace) {
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
        });
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
          style={{
            flex: 1,
            // justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                // paddingBottom: 20,
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
                {/* <Text>Awesome 🎉 {selectedSpace._id}</Text> */}
                <Text
                  style={{
                    fontSize: 17,
                    color: "#000",

                    fontWeight: "bold",
                  }}
                >
                  Expected Travel Time:{" "}
                  {Math.floor(spaceDetails.durations[0][0] / 60)} mins
                </Text>
                {/* <Text>Source: {spaceDetails.sources[0].name || "Unknown"}</Text>
                <Text>
                  Destination: {spaceDetails.destinations[0].name || "Unknown"}
                </Text> */}
                <BookingCard
                  origin={{
                    name: spaceDetails.sources[0].name || "Unknown",
                    date: `${new Date().getDate()}/${
                      new Date().getMonth() + 1
                    }/${new Date().getFullYear()} ${new Date().getMonth()}:${new Date().getHours()}:${new Date().getSeconds()}`,
                  }}
                  destination={{
                    name: spaceDetails.destinations[0].name || "Unknown",
                    // date: new Date().format("m-d-Y h:i:s"),
                    date: calculateArrivalDate(spaceDetails.durations[0][0]),
                  }}
                  price={selectedSpace.price}
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
                navigation.navigate("CarNavigationScreen", {
                  destinationCoords: selectedSpace.location.coordinates,
                });
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
