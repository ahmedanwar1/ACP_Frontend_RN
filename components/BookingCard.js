import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Icon } from "@rneui/themed";
import Dash from "react-native-dash";

const Bookingcard = ({ origin, destination, price }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSide}>
        <View style={styles.info}>
          <Icon
            // raised
            name="map-marker"
            type="font-awesome-5"
            color="#fff"
            style={{ ...styles.icons, backgroundColor: "#45A6DD" }}
            size={18}
          />
          <View style={styles.details}>
            <Text style={styles.primaryText}>{origin.name}</Text>
            <Text style={styles.secondaryText}>{origin.date}</Text>
          </View>
        </View>
        <Dash
          dashGap={10}
          style={styles.dash}
          dashThickness={3}
          dashStyle={{
            borderRadius: 100,
            overflow: "hidden",
            width: 6,
            height: 6,
          }}
          dashColor="#bbb"
        />
        <View style={styles.info}>
          <Icon
            // raised
            name="location-arrow"
            type="font-awesome-5"
            color="#fff"
            style={{
              ...styles.icons,
              backgroundColor: "#39B66A",
              transform: [{ rotate: "135deg" }],
            }}
            size={15}
          />
          <View style={styles.details}>
            <Text style={styles.primaryText}>{destination.name}</Text>
            <Text style={styles.secondaryText}>{destination.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.verticalDivider}></View>
      <View style={styles.rightSide}>
        <View style={styles.info}>
          <Icon
            // raised
            name="wallet"
            type="font-awesome-5"
            color="#fff"
            style={{
              ...styles.icons,
              width: 30,
              height: 30,
              backgroundColor: "#F98A8A",
            }}
            size={13}
          />
          <Text style={{ ...styles.secondaryText, ...styles.details }}>
            Price of the space
          </Text>
        </View>
        <View style={styles.details}>
          <View style={styles.priceDetails}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#000",
                fontSize: 30,
                paddingRight: 5,
              }}
            >
              {price}
            </Text>
            <Text style={styles.secondaryText}>EGP</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 10,
    // padding: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 13,
    shadowColor: "#999",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  icons: {
    height: 40,
    width: 40,
    marginVertical: 5,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    paddingLeft: 7,
  },
  primaryText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  secondaryText: {
    color: "#777",
    fontSize: 13,
  },
  leftSide: {
    flex: 1,
  },
  dash: {
    width: 1,
    height: 50,
    flexDirection: "column",
    marginLeft: 17,
    marginBottom: 8,
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ddd",
    marginLeft: 20,
  },
  priceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSide: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    paddingLeft: 20,
  },
});

export default Bookingcard;
