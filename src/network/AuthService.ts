import AxiosHelper from "./AxiosHelper";
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from "../redux/slice/auth/authType";

export const validatePassword = (password: string) => {
  const missing: string[] = [];

  if (password.length < 8) missing.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) missing.push("one uppercase letter");
  if (!/[0-9]/.test(password)) missing.push("one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) missing.push("one special character");

  if (missing.length === 0) return "";

  return `Password must contain ${missing.join(", ")}.`;
};


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

const changePassword = (body: {
  customerCode?: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {

  return new Promise((resolve, reject) => {
    AxiosHelper.httpPost({
      path: "/auth/change-password",
      queryParams: null,
      body,
    })
      .then((res: any) => {
        if (res.status === true) {
          resolve(res);
        } else {
          // console.warn("Password change failed:", res.message);
          reject(res.message);
        }
      })
      .catch((e) => {
        // console.error("Error occurred during password change:", e);
        reject(e);
      });
  });
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
  changePassword,
  forgotPassword,
  logoutUser,

};

export default AuthService;
