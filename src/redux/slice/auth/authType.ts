import type { TUser } from "../../../constants/model/user";

export interface AuthenticateUserRequest {
  username: string;
  password?: string;
  loginType?: string;
}

export interface AuthenticateUserResponse {
  status: boolean;
  data: TUser & {
    AccessToken?: string;
    RefreshToken?: string;
  };
  message: string;
  errors?: unknown[];
}

export interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
