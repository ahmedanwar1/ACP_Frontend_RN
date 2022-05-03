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

const MapComponent = ({
  children,
  showGPSButton = true,
  parkingSpaces,
  carNavigation,
  parkedCarLocation,
  enableInteraction = true,
}) => {
  let _mapView; //for map ref

  const dispatch = useDispatch();
  let currentCoords = useSelector(selectCurrentCoords); //get current coords of user

  const [mapReady, setMapReady] = useState(false);
  //init regin to start with.
  const [region, setRegion] = useState({
    latitude: currentCoords ? currentCoords.latitude : 30,
    longitude: currentCoords ? currentCoords.longitude : 31,
    latitudeDelta: parkingSpaces ? 0.02 : 0.0922,
    longitudeDelta: parkingSpaces ? 0.01 : 0.0421,
  });

  const animateCamera = (center, props) => {
    _mapView.animateCamera(
      {
        center: {
          latitude: center.latitude,
          longitude: center.longitude,
        },
        zoom: 15,
        ...props,
      },
      { duration: 1000 }
    );
  };

  //update region when user moves. to be sent to the backend for fetching by selected coords
  const onRegionChangeHandler = (e) => {
    setRegion(e);
  };

  //go to the users location on map when user clicks on gps button.
  const ChangeRegionToCurrentLocationHandler = (coords) => {
    console.log(currentCoords);
    if (currentCoords) {
      animateCamera(coords, { pitch: 0, altitude: 5, zoom: 15 });
    }
  };

  const onUserLocationChangeHandler = () => {
    console.log("location changed");
    if (carNavigation) {
      animateCamera(currentCoords, {
        pitch: 50,
        // altitude: 20,
        zoom: 19,
        heading: currentCoords.heading,
      });
    }
  };

  //check GPS and permissions when map init.
  useEffect(() => {
    (async () => {
      await dispatch(checkIfLocationEnabled()); //check if the GPS is on
      dispatch(getCurrentLocation()); //start watching user's currrent location
    })();
  }, []);

  useEffect(() => {
    //center the map to fit all markrs in case of picking spaces
    if (parkingSpaces && mapReady) {
      let marksCenter;
      const marksCoords = parkingSpaces.map((space) => {
        return {
          latitude: space.location.coordinates[0],
          longitude: space.location.coordinates[1],
        };
      });
      marksCenter = geolib.getCenter(marksCoords);
      //return the center coords of all spaces
      console.log(marksCenter);
      if (marksCenter && mapReady) {
        animateCamera(marksCenter, { zoom: 15 });
      }
    }
  }, [parkingSpaces, mapReady]);

  return (
    <>
      <MapView
        onMapReady={() => setMapReady(true)}
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
        /** */
        pitchEnabled={enableInteraction}
        rotateEnabled={enableInteraction}
        zoomEnabled={enableInteraction}
        scrollEnabled={enableInteraction}
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
