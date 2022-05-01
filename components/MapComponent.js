import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Icon } from "@rneui/themed";
import * as geolib from "geolib";
import {
  checkIfLocationEnabled,
  getCurrentLocation,
  selectCurrentCoords,
} from "../store/slices/mapSlice";
import { useDispatch, useSelector } from "react-redux";

const MapComponent = ({
  children,
  showGPSButton = true,
  parkingSpaces,
  carNavigation,
  parkedCarLocation,
}) => {
  const dispatch = useDispatch();
  let currentCoords = useSelector(selectCurrentCoords); //get current coords of user

  //center the map to fit all markrs in case of picking spaces
  let marksCenter;
  if (parkingSpaces) {
    marksCoords = parkingSpaces.map((space) => {
      return {
        latitude: space.location.coordinates[0],
        longitude: space.location.coordinates[1],
      };
    });
    marksCenter = geolib.getCenter(marksCoords); //return the center coords of all spaces
  }

  //init regin to start with.
  const [region, setRegion] = useState({
    latitude: parkingSpaces ? marksCenter.latitude : currentCoords.latitude,
    longitude: parkingSpaces ? marksCenter.longitude : currentCoords.longitude,
    latitudeDelta: parkingSpaces ? 0.02 : 0.0922,
    longitudeDelta: parkingSpaces ? 0.01 : 0.0421,
  });

  let _mapView; //for map ref

  //update region when user moves. to be sent to the backend for fetching by selected coords
  const onRegionChangeHandler = (e) => {
    setRegion(e);
  };

  //google maps style.
  const mapStyle = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#7c93a3",
        },
        {
          lightness: "-10",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#c2d1d6",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#dde3e3",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#c2d1d6",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#a9b4b8",
        },
        {
          lightness: "0",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#a3c7df",
        },
      ],
    },
  ];

  //go to the users location on map when user clicks on gps button.
  const ChangeRegionToCurrentLocationHandler = (coords) => {
    console.log(currentCoords);
    if (currentCoords) {
      _mapView.animateCamera(
        {
          center: coords,
          pitch: 0,
          altitude: 5,
          zoom: 15,
        },
        { duration: 2000 }
      );
    }
  };

  const onUserLocationChangeHandler = () => {
    console.log("location changed");
    if (carNavigation) {
      _mapView.animateCamera(
        {
          center: {
            latitude: currentCoords.latitude,
            longitude: currentCoords.longitude,
          },
          pitch: 50,
          // altitude: 20,
          zoom: 19,
          heading: currentCoords.heading,
        },
        { duration: 500 }
      );
    }
  };

  //check GPS and permissions when map init.
  useEffect(() => {
    (async () => {
      await dispatch(checkIfLocationEnabled()); //check if the GPS is on
      dispatch(getCurrentLocation()); //start watching user's currrent location
    })();
  }, []);

  return (
    <>
      <MapView
        customMapStyle={mapStyle}
        ref={(mapView) => {
          _mapView = mapView;
        }}
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        initialRegion={region}
        // region={region}
        userInterfaceStyle="dark"
        // onRegionChange={onRegionChangeHandler}
        onRegionChangeComplete={onRegionChangeHandler}
        showsUserLocation
        followUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        onUserLocationChange={onUserLocationChangeHandler}
      >
        {children}
      </MapView>
      {showGPSButton && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: parkedCarLocation ? 20 : 80,
            right: 10,
          }}
          onPress={() => {
            ChangeRegionToCurrentLocationHandler(currentCoords);
          }}
        >
          <Icon
            raised
            name="locate"
            type="ionicon"
            color="#000"
            style={{
              backgroundColor: "#fff",
              zIndex: 8,
            }}
            size={28}
          />
        </TouchableOpacity>
      )}
      {parkedCarLocation && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 100,
            right: 10,
          }}
          onPress={() => {
            ChangeRegionToCurrentLocationHandler(parkedCarLocation);
          }}
        >
          <Icon
            raised
            name="car"
            type="ionicon"
            color="#000"
            style={{
              backgroundColor: "#fff",
              zIndex: 8,
            }}
            size={28}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default MapComponent;
