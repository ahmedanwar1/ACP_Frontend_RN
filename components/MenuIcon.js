import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Icon } from "@rneui/themed";

import { DrawerActions, useNavigation } from "@react-navigation/native";

const MenuIcon = ({ style }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <View style={{ ...styles.menuContainer, ...style }}>
        <Icon
          // raised
          name="bars"
          type="font-awesome-5"
          color="#39B66A"
          style={{ backgroundColor: "rgba(0,0,0,0)" }}
          size={25}
        />
      </View>
    </TouchableOpacity>
  );
};

export default MenuIcon;

const styles = StyleSheet.create({
  menuContainer: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: "#fff",
    width: 50,
    borderRadius: 10,
    shadowColor: "#444",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
