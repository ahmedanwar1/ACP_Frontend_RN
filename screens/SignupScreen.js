import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  // KeyboardAvoidingView
} from "react-native";
import axios from "axios";
import { Alert } from "react-native";
import Constants from "expo-constants";

export default function SignupScreen({ navigation }) {
  const [uni_ID, setID] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  // const [carPlate, setCarPlate] = useState("");
  const [show, setShow] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const { manifest } = Constants;

  const registerHandler = () => {
    if (
      uni_ID.trim() == "" ||
      fullName.trim() == "" ||
      password.trim() == "" ||
      phoneNum.trim() == ""
    ) {
      return Alert.alert("Fill all inputs!");
    }
    axios
      .post(
        `http://${manifest.debuggerHost.split(":").shift()}:4000/register`,
        {
          name: fullName,
          registration_number: uni_ID,
          password,
          phone: phoneNum,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (!response.data.error) {
          navigation.navigate("LoginScreen");
          return Alert.alert("Registeration completed!");
        } else {
          Alert.alert(response.data.message);
        }
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      });
  };

  return (
    // <View>
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* <Text style={{ fontWeight: "bold" }}>Welcome to ACP</Text> */}
        <Image
          style={styles.image}
          source={require("../assets/ACP_LOGO.png")}
        />

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Full Name"
            placeholderTextColor="#003f5c"
            onChangeText={(fullName) => setFullName(fullName)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter University ID"
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

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Phone"
            placeholderTextColor="#003f5c"
            onChangeText={(phoneNum) => setPhoneNum(phoneNum)}
          />
        </View>

        {/* <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Car Plate"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View> */}

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            registerHandler();
          }}
        >
          <Text style={styles.loginText}>Register Now</Text>
        </TouchableOpacity>

        <Text style={styles.sideText}>Have an account?</Text>
        <Text
          style={styles.regNowText}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Login Now
        </Text>
      </View>
    </KeyboardAwareScrollView>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
  },

  image: {
    // marginBottom: 40,
    // borderRadius: 30,
    width: 200,
    height: 200,
  },

  inputView: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    width: "90%",
    height: 45,
    marginBottom: 20,
    alignItems: "stretch",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    // marginVertical: 20,
    borderRadius: 10,
    borderColor: "#999",
    borderWidth: 1,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  btnEye: {
    position: "absolute",
    right: 25,
    top: 8,
  },

  regNowText: {
    // position: "absolute",
    color: "blue",
    // right: 90,
    // bottom: 102,
    marginBottom: 40,
  },

  sideText: {
    position: "relative",
    marginBottom: 20,
    // left: -50,
    // bottom: -10,
  },

  loginBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#90ee90",
    borderColor: "#fff",
    borderWidth: 1,
  },
});
