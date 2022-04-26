// import * as Location from "expo-location";
// import { useDispatch } from "react-redux";

// // let foregroundSubscription = null;

// const dispatch = useDispatch();

// export const CheckIfLocationEnabled = async () => {
//   try {
//     const enabled = await Location.hasServicesEnabledAsync();

//     if (enabled) {
//       dispatch(setGPSEnabled(true));
//       return true;
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return false;
// };

// export const GetCurrentLocation = async () => {
//   try {
//     let { status } = await Location.requestForegroundPermissionsAsync();

//     if (status == "granted") {
//       // Make sure that foreground location tracking is not running
//       foregroundSubscription?.remove();

//       // Start watching position in real-time
//       foregroundSubscription = await Location.watchPositionAsync(
//         {
//           // For better logs, we set the accuracy to the most sensitive option
//           accuracy: Location.Accuracy.BestForNavigation,
//         },
//         (location) => {
//           dispatch(setCurrentCoords(location.coords));
//         }
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
