import type { TUser } from "../../../constants/model/user";

export interface AuthenticateUserRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  name: string;
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
  data?: unknown;
  errors?: Array<{ field: string; message: string; kind?: string }>;
  RequestId?: string;
}

export type ForgotPasswordField = keyof ForgotPasswordRequest;

export interface AuthenticateUserResponse {
  status: boolean;
  reset_pwd_required?: boolean;
  data: {
    token: string;
    refreshToken: string;
    userDetails: TUser;
    reset_pwd_required?: boolean;
  };
  message: string;
  errors?: unknown[];
  RequestId?: string;
}

export interface AuthenticatedUserResult {
  status: boolean;
  data: TUser;
  resetPasswordRequired: boolean;
  message: string;
  errors?: unknown[];
  RequestId?: string;
}

export interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  resetPasswordRequired: boolean;
  isLoading: boolean;
  error: string | null;
  forgotPasswordForm: ForgotPasswordRequest;
  isResettingForgotPassword: boolean;
  forgotPasswordError: string | null;
}
