import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";
// import { useSelector, useDispatch } from 'react-redux'

const initialState = {
  currentCoords: null,
  GPSEnabled: false,
  foregroundSubscription: null,
  remainingTimeToArrive: 0,
  destinationCoords: null,
  parkedCarLocation: null,
};

//check GPS is on or off
export const checkIfLocationEnabled = createAsyncThunk(
  "map/checkIfLocationEnabled",
  async (_, { dispatch }) => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (enabled) {
        dispatch(setGPSEnabled(true));
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(setGPSEnabled(false));
    return false;
  }
);

//get and watch user's current coords
export const getCurrentLocation = createAsyncThunk(
  "map/getCurrentLocation",
  async (_, { dispatch, getState }) => {
    try {
      const { foregroundSubscription } = getState().map;
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status == "granted") {
        // Make sure that foreground location tracking is not running
        if (foregroundSubscription) {
          dispatch(setForegroundSubscription(null));
        }

        // Start watching position in real-time
        let foregroundSub = await Location.watchPositionAsync(
          {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
          },
          (location) => {
            dispatch(setCurrentCoords(location.coords));
          }
        );
        dispatch(setForegroundSubscription(foregroundSub));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCurrentCoords: (state, { payload }) => {
      state.currentCoords = payload;
    },
    setGPSEnabled: (state, { payload }) => {
      state.GPSEnabled = payload;
    },
    setForegroundSubscription: (state, { payload }) => {
      state.foregroundSubscription = payload;
    },
    setRemainingTimeToArrive: (state, { payload }) => {
      state.remainingTimeToArrive = payload;
    },
    setDestinationCoords: (state, { payload }) => {
      state.destinationCoords = payload;
    },
    setParkedCarLocation: (state, { payload }) => {
      state.parkedCarLocation = payload;
    },
  },
  extraReducers: {
    [checkIfLocationEnabled.rejected]: (state, { payload }) => {
      state.GPSEnabled = false;
    },
    [getCurrentLocation.rejected]: (state, { payload }) => {
      state.currentCoords = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentCoords,
  setGPSEnabled,
  setRemainingTimeToArrive,
  setDestinationCoords,
  setParkedCarLocation,
} = mapSlice.actions;

export const selectCurrentCoords = (state) => state.map.currentCoords;
export const selectGPSEnabled = (state) => state.map.GPSEnabled;
export const selectRemainingTimeToArrive = (state) =>
  state.map.remainingTimeToArrive;
export const selectDestinationCoords = (state) => state.map.destinationCoords;
export const selectParkedCarLocation = (state) => state.map.parkedCarLocation;

export default mapSlice.reducer;
