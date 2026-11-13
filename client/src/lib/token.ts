import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "accessToken";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(KEY, token);
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}

export async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem(KEY);
  }
  return SecureStore.getItemAsync(KEY);
}

export async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
