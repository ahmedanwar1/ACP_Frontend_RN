import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BookingScreen from "./screens/BookingScreen";
import HistoryScreen from "./screens/HistoryScreen";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import MapStack from "./navigation/MapStack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import CustomDrawer from "./components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <MyDrawer />
          <StatusBar backgroundColor="rgba(0,0,0,0)" />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="MapStack"
    >
      <Drawer.Screen
        name="MapStack"
        component={MapStack}
        options={{
          headerShown: false,
          // headerTintColor: "transparent",
          title: "Reservation",
        }}
      />
      <Drawer.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{
          title: "Booking",
          headerTintColor: "#39B66A",
          headerTitleAlign: "center",
        }}
      />
      <Drawer.Screen
        name="historyScreen"
        component={HistoryScreen}
        options={{
          // headerTransparent: true,
          headerTintColor: "#39B66A",
          headerTitleAlign: "center",
          title: "History",
          headerStyle: {},
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({});
