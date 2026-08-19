import AxiosHelper from "./AxiosHelper";
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../redux/slice/auth/authType";

const authenticateUser = async ({ username, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> => {
  const response = (await AxiosHelper.httpPost({
    path: "auth/login",
    queryParams: null,
    body: { username, password },
  })) as AuthenticateUserResponse;

  if (!response.status) {
    throw new Error(response.message || "Please Contact IT team.");
  }

  return response;
};

const forgotPassword = async (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = (await AxiosHelper.httpPost({
    path: "auth/forgot-password",
    queryParams: null,
    body: {
      name: request.name,
      user_name: request.username,
      new_password: request.newPassword,
      confirm_password: request.confirmPassword,
    },
  })) as ForgotPasswordResponse;

  if (!response.status) throw new Error(response.message || "Unable to reset password.");
  return response;
};

const logoutUser = async (): Promise<void> => {
  await AxiosHelper.httpPost({
    path: "auth/logout",
    queryParams: null,
    body: null,
  });
};


const AuthService = {
  authenticateUser,
  forgotPassword,
  logoutUser,

};

export default AuthService;
