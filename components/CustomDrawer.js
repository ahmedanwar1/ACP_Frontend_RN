import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Avatar, Icon } from "@rneui/themed";
import Dash from "react-native-dash";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/base";
import { useDispatch } from "react-redux";
import { setUserInfo, setUserToken } from "../store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawer = (props) => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      {/* <Image
        style={{ width: 150, height: 150 }}
        source={require("../assets/ACP_LOGO.png")}
      /> */}

      <DrawerContentScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <Image
          style={styles.image}
          source={require("../assets/images/driving-school.png")}
        />
        <View>
          <Text style={{ fontWeight: "700", fontSize: 14 }}>Ahmed Anwar</Text>
          <Text>18103033</Text>
        </View>
      </View>
      <Button
        type="outline"
        color="red"
        title="Sign out"
        titleStyle={{ color: "#e0040f" }}
        buttonStyle={{
          borderColor: "#e0040f",
          // width: "70%",
          // margin: 15,
        }}
        onPress={() => {
          console.log("djdjdj");
          dispatch(setUserToken(null));
          dispatch(setUserInfo(null));
          AsyncStorage.removeItem("userToken");
          AsyncStorage.removeItem("userInfo");
          // props.navigation.closeDrawer();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    // backgroundColor: "#F22",
    height: 80,
    borderRadius: 50,
  },
});

export default CustomDrawer;
