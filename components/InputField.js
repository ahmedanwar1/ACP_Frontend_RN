import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Icon } from "@rneui/themed";

const InputField = ({ icon, placeholder, text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inputContainer}>
        <Icon
          // raised
          name={icon}
          type="font-awesome-5"
          color="#999"
          style={{ paddingHorizontal: 10 }}
          size={18}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          editable={false}
          // onChangeText={onChangeText}
          value={text}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  input: {
    fontSize: 16,
    // outlineWidth: 0,
    color: "#333",
    flex: 1,
    height: 30,
  },
});

export default InputField;
