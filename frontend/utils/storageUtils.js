import AsyncStorage from "@react-native-async-storage/async-storage";
import { serverTimestamp } from "firebase/firestore";

export const getAuthData = async () => {
  try {
    const { userId, accessToken } = (
      await AsyncStorage.multiGet(["userId", "accessToken"])
    ).map(([, value]) => value);

    if (!userId || !accessToken) {
      return null;
    }

    const isValid = (accessToken) => {
      const [, payload] = accessToken.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp > serverTimestamp().seconds;
    };

    if (isValid(accessToken)) {
      return { userId, accessToken };
    } else {
      await AsyncStorage.multiRemove(["userId", "accessToken"]);
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

export const storeAuthData = async (userId, accessToken) => {
  try {
    await AsyncStorage.multiSet([
      ["userId", userId],
      ["accessToken", accessToken],
    ]);
  } catch (error) {
    console.error(error);
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(["userId", "accessToken"]);
  } catch (error) {
    console.error(error);
  }
};