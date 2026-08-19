import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import SecureStorage from "../../../utils/SecureStorage";
import {
  LSK_IS_LOGGED_IN,
  LSK_FORCE_PASSWORD_CHANGE,
  LSK_USER_DETAILS,
} from "../../../constants/local-storage-constants";
import type { TUser } from "../../../constants/model/user";
import { authenticateUser, forgotPassword, logoutUser } from "./authThunk";
import { resetPassword } from "../user/userThunk";
import type { AuthState, ForgotPasswordField } from "./authType";

const emptyForgotPasswordForm = {
  name: "",
  username: "",
  newPassword: "",
  confirmPassword: "",
};

const readStoredUser = (): TUser | null => {
  const storedUser = SecureStorage.getItem(LSK_USER_DETAILS);
  if (typeof storedUser !== "string") return null;

  try {
    return JSON.parse(storedUser) as TUser;
  } catch {
    return null;
  }
};

const storedUser = readStoredUser();
const storedLogin = Number(SecureStorage.getItem(LSK_IS_LOGGED_IN) ?? 0) === 1;
const storedResetRequired =
  String(SecureStorage.getItem(LSK_FORCE_PASSWORD_CHANGE) ?? "false") === "true";

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: storedLogin && storedUser !== null,
  resetPasswordRequired: storedLogin && storedResetRequired,
  isLoading: false,
  error: null,
  forgotPasswordForm: { ...emptyForgotPasswordForm },
  isResettingForgotPassword: false,
  forgotPasswordError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    updateForgotPasswordField: (
      state,
      action: PayloadAction<{ field: ForgotPasswordField; value: string }>,
    ) => {
      state.forgotPasswordForm[action.payload.field] = action.payload.value;
      state.forgotPasswordError = null;
    },
    resetForgotPasswordForm: (state) => {
      state.forgotPasswordForm = { ...emptyForgotPasswordForm };
      state.isResettingForgotPassword = false;
      state.forgotPasswordError = null;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.resetPasswordRequired = false;
    },
    sessionExpired: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.resetPasswordRequired = false;
      state.isLoading = false;
      state.error = "Your session has expired. Please sign in again.";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.resetPasswordRequired = action.payload.resetPasswordRequired;
        state.user = action.payload.data;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.resetPasswordRequired = false;
        state.user = null;
        state.error = action.payload ?? action.error.message ?? "Authentication failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.resetPasswordRequired = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordRequired = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isResettingForgotPassword = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isResettingForgotPassword = false;
        state.forgotPasswordError = null;
        state.forgotPasswordForm = { ...emptyForgotPasswordForm };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isResettingForgotPassword = false;
        state.forgotPasswordError =
          action.payload ?? action.error.message ?? "Unable to reset password.";
      });
  },
});

export const {
  clearAuthError,
  resetForgotPasswordForm,
  sessionExpired,
  setUser,
  updateForgotPasswordField,
} = authSlice.actions;
export default authSlice.reducer;
