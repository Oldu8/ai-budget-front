import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/** SecureStore is not available on web; use AsyncStorage there. */
const storage = Platform.OS === 'web' ? null : SecureStore;

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  if (storage) {
    await storage.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    await storage.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } else {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export async function loadTokens(): Promise<StoredTokens | null> {
  let accessToken: string | null;
  let refreshToken: string | null;
  if (storage) {
    accessToken = await storage.getItemAsync(ACCESS_TOKEN_KEY);
    refreshToken = await storage.getItemAsync(REFRESH_TOKEN_KEY);
  } else {
    accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
}

export async function clearTokens(): Promise<void> {
  if (storage) {
    await storage.deleteItemAsync(ACCESS_TOKEN_KEY);
    await storage.deleteItemAsync(REFRESH_TOKEN_KEY);
  } else {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }
}
