import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../../network/AuthService";
import SecureStorage from "../../../utils/SecureStorage";
import {
  LSK_IS_LOGGED_IN,
  LSK_REFRESH_TOKEN,
  LSK_TOKEN,
  LSK_USER_DETAILS,
} from "../../../constants/local-storage-constants";
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from "./authType";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unable to authenticate user";
};

export const authenticateUser = createAsyncThunk<
  AuthenticateUserResponse,
  AuthenticateUserRequest,
  { rejectValue: string }
>("auth/authenticateUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await AuthService.authenticateUser(credentials);
    const { AccessToken, RefreshToken, ...user } = response.data;

    if (AccessToken) SecureStorage.setItem(LSK_TOKEN, AccessToken);
    if (RefreshToken) SecureStorage.setItem(LSK_REFRESH_TOKEN, RefreshToken);
    SecureStorage.setItem(LSK_IS_LOGGED_IN, 1);
    SecureStorage.setItem(LSK_USER_DETAILS, JSON.stringify(user));

    return { ...response, data: user };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logoutUser",
  async () => {
    try {
      await AuthService.logoutUser();
    } catch {
      // Local logout must still complete if the server session already expired.
    } finally {
      SecureStorage.clearAll();
    }
  },
);
