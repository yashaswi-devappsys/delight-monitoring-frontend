import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/authThunk";
import { changePassword, createNewUser } from "./userThunk";
import type { ChangePasswordField, UserState } from "./userType";

const emptyChangePasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialState: UserState = {
  isChangingPassword: false,
  changePasswordError: null,
  changePasswordSuccess: null,
  isChangePasswordFormOpen: false,
  changePasswordForm: emptyChangePasswordForm,
  createUserName: "",
  isCreatingUser: false,
  createUserError: null,
  createUserFieldErrors: [],
  createdUser: null,
};

const resetChangePasswordState = (state: UserState) => {
  state.isChangingPassword = false;
  state.isChangePasswordFormOpen = false;
  state.changePasswordForm = { ...emptyChangePasswordForm };
  state.changePasswordError = null;
  state.changePasswordSuccess = null;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearChangePasswordStatus: (state) => {
      state.changePasswordError = null;
      state.changePasswordSuccess = null;
    },
    openChangePasswordForm: (state) => {
      state.isChangePasswordFormOpen = true;
      state.changePasswordError = null;
      state.changePasswordSuccess = null;
    },
    closeChangePasswordForm: (state) => {
      resetChangePasswordState(state);
    },
    updateChangePasswordField: (
      state,
      action: PayloadAction<{ field: ChangePasswordField; value: string }>,
    ) => {
      state.changePasswordForm[action.payload.field] = action.payload.value;
    },
    updateCreateUserName: (state, action: PayloadAction<string>) => {
      state.createUserName = action.payload;
      state.createUserError = null;
      state.createUserFieldErrors = [];
      state.createdUser = null;
    },
    resetCreateUserForm: (state) => {
      state.createUserName = "";
      state.isCreatingUser = false;
      state.createUserError = null;
      state.createUserFieldErrors = [];
      state.createdUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isChangingPassword = false;
        state.changePasswordSuccess = action.payload.message;
        state.isChangePasswordFormOpen = false;
        state.changePasswordForm = { ...emptyChangePasswordForm };
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.changePasswordError =
          action.payload ?? action.error.message ?? "Unable to change password.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        resetChangePasswordState(state);
        state.createUserName = "";
        state.isCreatingUser = false;
        state.createUserError = null;
        state.createUserFieldErrors = [];
        state.createdUser = null;
      })
      .addCase(createNewUser.pending, (state) => {
        state.isCreatingUser = true;
        state.createUserError = null;
        state.createUserFieldErrors = [];
        state.createdUser = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.isCreatingUser = false;
        state.createUserName = "";
        state.createdUser = action.payload.data;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.isCreatingUser = false;
        state.createUserError =
          action.payload?.message ?? action.error.message ?? "Unable to create user";
        state.createUserFieldErrors = action.payload?.errors ?? [];
      });
  },
});

export const {
  clearChangePasswordStatus,
  closeChangePasswordForm,
  openChangePasswordForm,
  resetCreateUserForm,
  updateChangePasswordField,
  updateCreateUserName,
} = userSlice.actions;

export default userSlice.reducer;
