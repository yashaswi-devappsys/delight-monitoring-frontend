import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../../network/AuthService";
import SecureStorage from "../../../utils/SecureStorage";
import {
  LSK_IS_LOGGED_IN,
  LSK_FORCE_PASSWORD_CHANGE,
  LSK_REFRESH_TOKEN,
  LSK_TOKEN,
  LSK_USER_DETAILS,
} from "../../../constants/local-storage-constants";
import type {
  AuthenticatedUserResult,
  AuthenticateUserRequest,
  ForgotPasswordRequest,
} from "./authType";
import { getPasswordValidationMessage } from "../../../utils/passwordValidation";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unable to authenticate user";
};

export const authenticateUser = createAsyncThunk<
  AuthenticatedUserResult,
  AuthenticateUserRequest,
  { rejectValue: string }
>("auth/authenticateUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await AuthService.authenticateUser(credentials);
    const { token, refreshToken, userDetails } = response.data;
    const resetPasswordRequired = Boolean(
      response.reset_pwd_required ??
      response.data.reset_pwd_required ??
      userDetails.reset_pwd_required,
    );

    SecureStorage.setItem(LSK_TOKEN, token);
    SecureStorage.setItem(LSK_REFRESH_TOKEN, refreshToken);
    SecureStorage.setItem(LSK_IS_LOGGED_IN, 1);
    SecureStorage.setItem(LSK_USER_DETAILS, JSON.stringify(userDetails));
    SecureStorage.setItem(LSK_FORCE_PASSWORD_CHANGE, resetPasswordRequired);

    return { ...response, data: userDetails, resetPasswordRequired };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk<
  { message: string },
  ForgotPasswordRequest,
  { rejectValue: string }
>("auth/forgotPassword", async (request, { rejectWithValue }) => {
  try {
    if (request.newPassword !== request.confirmPassword) {
      return rejectWithValue("New password and confirmation do not match.");
    }

    const validationMessage = getPasswordValidationMessage(request.newPassword);
    if (validationMessage) return rejectWithValue(validationMessage);

    const response = await AuthService.forgotPassword({
      ...request,
      name: request.name.trim(),
      username: request.username.trim(),
    });
    return { message: response.message || "Password reset successfully." };
  } catch (error) {
    const apiError = error as Error & { data?: { message?: string } };
    return rejectWithValue(apiError.data?.message || getErrorMessage(error));
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
