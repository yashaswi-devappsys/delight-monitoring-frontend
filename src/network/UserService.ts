import rsAxiosInstance from "./AxiosConfig";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreateUserRequest,
  CreateUserResponse,
} from "../redux/slice/user/userType";

const changePassword = async (
  request: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = (await rsAxiosInstance.post("users/change-password", {
    current_password: request.currentPassword,
    new_password: request.newPassword,
    confirm_password: request.confirmPassword,
  })) as unknown as ChangePasswordResponse;

  if (!response.status) {
    const error = new Error(response.message || "Unable to change password") as Error & {
      errors?: ChangePasswordResponse["errors"];
    };
    error.errors = response.errors;
    throw error;
  }

  return response;
};

const createNewUser = async (request: CreateUserRequest): Promise<CreateUserResponse> => {
  const response = (await rsAxiosInstance.post(
    "users/new-user",
    request,
  )) as unknown as CreateUserResponse;

  if (!response.status) {
    const error = new Error(response.message || "Please Contact IT") as Error & {
      errors?: CreateUserResponse["errors"];
    };
    error.errors = response.errors;
    throw error;
  }

  return response;
};

const UserService = {
  changePassword,
  createNewUser,
};

export default UserService;
