import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "@rneui/themed";
import * as geolib from "geolib";
import {
  checkIfLocationEnabled,
  getCurrentLocation,
  selectCurrentCoords,
} from "../store/slices/mapSlice";
import { useDispatch, useSelector } from "react-redux";

const MapComponent = ({ children, showGPSButton = true, parkingSpaces }) => {
  const dispatch = useDispatch();
  let currentCoords = useSelector(selectCurrentCoords);

  let marksCenter;
  if (parkingSpaces) {
    marksCoords = parkingSpaces.map((space) => {
      return {
        latitude: space.location.coordinates[0],
        longitude: space.location.coordinates[1],
      };
    });
    marksCenter = geolib.getCenter(marksCoords);
  }

  const [region, setRegion] = useState({
    latitude: parkingSpaces ? marksCenter.latitude : currentCoords.latitude,
    longitude: parkingSpaces ? marksCenter.longitude : currentCoords.longitude,
    latitudeDelta: parkingSpaces ? 0.02 : 0.0922,
    longitudeDelta: parkingSpaces ? 0.01 : 0.0421,
  });

  let _mapView;

  const onRegionChangeHandler = (e) => {
    setRegion(e);
  };

  const onMapReadyHandler = () => {
    // if (parkingSpaces) {
    //   marksCoords = parkingSpaces.map((space) => {
    //     return {
    //       latitude: space.location.coordinates[1],
    //       longitude: space.location.coordinates[0],
    //     };
    //   });
    //   let marksCenter = geolib.getCenter(marksCoords);
    //   _mapView.animateCamera(
    //     {
    //       center: marksCenter,
    //       pitch: 0,
    //       altitude: 5,
    //       zoom: 30,
    //     },
    //     { duration: 2000 }
    //   );
    // }
  };

  // useEffect(() => {

  // }, [parkingSpaces]);

  // setTimeout(() => {
  //   if (parkingSpaces) {
  //     marksCoords = parkingSpaces.map((space) => {
  //       return {
  //         latitude: space.location.coordinates[1],
  //         longitude: space.location.coordinates[0],
  //       };
  //     });
  //     let marksCenter = geolib.getCenter(marksCoords);
  //     _mapView.animateCamera(
  //       {
  //         center: marksCenter,
  //         pitch: 0,
  //         altitude: 5,
  //         zoom: 30,
  //       },
  //       { duration: 2000 }
  //     );
  //   }
  // }, 2000);

  const ChangeRegionToCurrentLocationHandler = () => {
    console.log(currentCoords);
    if (currentCoords) {
      _mapView.animateCamera(
        {
          center: {
            latitude: currentCoords.latitude,
            longitude: currentCoords.longitude,
          },
          pitch: 0,
          altitude: 5,
          zoom: 15,
        },
        { duration: 2000 }
      );
    }
  };

  useEffect(() => {
    (async () => {
      await dispatch(checkIfLocationEnabled());
      dispatch(getCurrentLocation());
    })();
  }, []);

  return (
    <>
      <MapView
        // provider="mapbox"
        customMapStyle={[
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
        ]}
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
        userInterfaceStyle="dark"
        // onRegionChange={onRegionChangeHandler}
        onRegionChangeComplete={onRegionChangeHandler}
        showsUserLocation
        followUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        onMapLoaded={onMapReadyHandler}
        // compassOffset={{ x: 80, y: 150 }}
        // zoomControlEnabled
      >
        {children}
      </MapView>
      {showGPSButton && (
        <TouchableOpacity
          style={{ position: "absolute", bottom: 80, right: 10 }}
          onPress={() => {
            ChangeRegionToCurrentLocationHandler();
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
              // position: "absolute",
              // bottom: 5,
              // justifyContent: "center",
              // alignItems: "center",
            }}
            size={28}
          />
        </TouchableOpacity>
      )}
    </>
    // </View>
  );
};

const styles = StyleSheet.create({});

export default MapComponent;
