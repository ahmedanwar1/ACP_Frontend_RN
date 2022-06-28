import React, { useState } from "react";
// import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo, setUserToken } from "../store/slices/userSlice";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [uni_ID, setID] = useState("18103033");
  const [password, setPassword] = useState("123456789");
  const [show, setShow] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const { manifest } = Constants;

  const loginHandler = () => {
    console.log(uni_ID, password);
    axios
      .post(`http://${manifest.debuggerHost.split(":").shift()}:4000/login`, {
        userId: uni_ID,
        password,
      })
      .then((response) => {
        if (response.data.success != undefined && response.data.success) {
          console.log(response.data.token);
          dispatch(setUserToken(response.data.token));
          dispatch(setUserInfo(response.data.user));
          AsyncStorage.setItem("userToken", response.data.token);
          AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold" }}>Welcome to ACP</Text>
      <Image style={styles.image} source={require("../assets/ACP_LOGO.png")} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter University ID"
          defaultValue="18103033"
          placeholderTextColor="#003f5c"
          onChangeText={(uni_ID) => setID(uni_ID)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={visible}
          defaultValue="123456789"
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          style={styles.btnEye}
          onPress={() => {
            setShow(!show);
            setVisible(!visible);
          }}
        >
          <MaterialCommunityIcons
            name={show === false ? "eye-outline" : "eye-off-outline"}
            size={26}
          />
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity>
        <Text
          style={styles.forgot_button}
          onPress={() => Linking.openURL("someLocation.com")}
        >
          Login now
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.loginBtn} onPress={() => loginHandler()}>
        <Text style={styles.loginText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.sideText}>Not a member?</Text>
      <Text
        style={styles.regNowText}
        onPress={() => navigation.navigate("SignupScreen")}
      >
        Register Now
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
    borderRadius: 30,
    width: 250,
    height: 250,
  },

  inputView: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    width: "90%",
    height: 45,
    marginBottom: 20,

    // alignItems: "center",
    alignItems: "stretch",
  },

  TextInput: {
    height: 50,
    // width: 100,
    // paddingHorizontal: 0,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    borderRadius: 10,
    borderColor: "#999",
    borderWidth: 1,
  },

  forgot_button: {
    position: "absolute",
    color: "blue",
    height: 30,
    marginBottom: 30,
    left: 60,
  },

  btnEye: {
    position: "absolute",
    right: 25,
    top: 8,
  },

  regNowText: {
    // position: "absolute",
    color: "blue",
    // right: 50,
    // bottom: 199,
  },

  sideText: {
    position: "relative",
    // left: -20,
    // bottom: -10,
    margin: 20,
    color: "#000",
  },

  loginBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#90ee90",
    borderColor: "#fff",
    borderWidth: 1,
  },
});
