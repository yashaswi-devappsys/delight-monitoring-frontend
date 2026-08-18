import AxiosHelper from "./AxiosHelper";
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
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

const forgotPassword = (body: null) => {
  return new Promise((resolve, reject) => {
    AxiosHelper.httpPost({
      path: "auth/forgot-password",
      queryParams: null,
      body,
    })
      .then((res: any) => {
        if (res.status === true) {
          resolve(res);
        } else {
          reject(res.message);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
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
