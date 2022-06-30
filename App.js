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
import AuthStack from "./navigation/AuthStack";
import Main from "./navigation/Main";

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
          <Main />
          <StatusBar backgroundColor="rgba(0,0,0,0)" />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
