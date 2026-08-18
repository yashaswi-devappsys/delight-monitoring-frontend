import type { TUser } from "../../../constants/model/user";

export interface AuthenticateUserRequest {
  username: string;
  password: string;
}

export interface AuthenticateUserResponse {
  status: boolean;
  data: {
    token: string;
    refreshToken: string;
    userDetails: TUser;
  };
  message: string;
  errors?: unknown[];
  RequestId?: string;
}

export interface AuthenticatedUserResult {
  status: boolean;
  data: TUser;
  message: string;
  errors?: unknown[];
  RequestId?: string;
}

export interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
