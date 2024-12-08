import { ActivityIndicator, View } from "react-native";
import React from "react";

export const LoadingIndicator = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
