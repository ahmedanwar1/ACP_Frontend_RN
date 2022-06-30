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
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserInfo,
  setUserInfo,
  setUserToken,
} from "../store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setDestinationCoords,
  setParkedCarLocation,
} from "../store/slices/mapSlice";

const CustomDrawer = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
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
          source={require("../assets/images/hacker.png")}
        />
        <View>
          <Text style={{ fontWeight: "700", fontSize: 14 }}>
            {userInfo.name}
          </Text>
          <Text>{userInfo.userId}</Text>
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
          props.navigation.closeDrawer();
          dispatch(setUserToken(null));
          dispatch(setUserInfo(null));
          dispatch(setDestinationCoords(null));
          dispatch(setParkedCarLocation(null));
          AsyncStorage.removeItem("userToken");
          AsyncStorage.removeItem("userInfo");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 70,
    // backgroundColor: "#F22",
    height: 70,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default CustomDrawer;
