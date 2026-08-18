import { createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "../../../network/UserService";
import type {
  ChangePasswordRequest,
  ChangePasswordResult,
  CreatedUserCredentials,
  CreateUserFieldError,
  CreateUserRejectValue,
  CreateUserRequest,
} from "./userType";
import { getPasswordValidationMessage } from "../../../utils/passwordValidation";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unable to change password.";
};

export const changePassword = createAsyncThunk<
  ChangePasswordResult,
  ChangePasswordRequest,
  { rejectValue: string }
>("user/changePassword", async (request, { rejectWithValue }) => {
  try {
    if (request.newPassword !== request.confirmPassword) {
      return rejectWithValue("New password and confirmation do not match.");
    }

    const passwordValidationMessage = getPasswordValidationMessage(request.newPassword);
    if (passwordValidationMessage) {
      return rejectWithValue(passwordValidationMessage);
    }

    const response = await UserService.changePassword(request);
    return { message: response.message || "Password changed successfully." };
  } catch (error) {
    const apiError = error as Error & { data?: { message?: string } };
    return rejectWithValue(apiError.data?.message || getErrorMessage(error));
  }
});

export const createNewUser = createAsyncThunk<
  { message: string; data: CreatedUserCredentials },
  CreateUserRequest,
  { rejectValue: CreateUserRejectValue }
>("user/createNewUser", async (request, { rejectWithValue }) => {
  try {
    const response = await UserService.createNewUser({ name: request.name.trim() });
    return { message: response.message, data: response.data };
  } catch (error) {
    const apiError = error as Error & {
      errors?: CreateUserFieldError[];
      data?: { message?: string; errors?: CreateUserFieldError[] };
    };

    return rejectWithValue({
      message: apiError.data?.message || apiError.message || "Unable to create user",
      errors: apiError.errors || apiError.data?.errors || [],
    });
  }
});
