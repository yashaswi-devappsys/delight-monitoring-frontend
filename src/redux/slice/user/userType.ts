export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResult {
  message: string;
}

export interface ChangePasswordResponse {
  status: boolean;
  message: string;
  data?: unknown;
  errors?: Array<{
    field: string;
    message: string;
    kind?: string;
  }>;
  RequestId?: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  errors?: Array<{ field: string; message: string; kind?: string }>;
  RequestId?: string;
}

export type ChangePasswordField = keyof ChangePasswordRequest;

export interface UserState {
  isResettingPassword: boolean;
  resetPasswordError: string | null;
  resetPasswordForm: ChangePasswordRequest;
  isChangingPassword: boolean;
  changePasswordError: string | null;
  changePasswordSuccess: string | null;
  isChangePasswordFormOpen: boolean;
  changePasswordForm: ChangePasswordRequest;
  createUserName: string;
  isCreatingUser: boolean;
  createUserError: string | null;
  createUserFieldErrors: CreateUserFieldError[];
  createdUser: CreatedUserCredentials | null;
}

export interface CreateUserRequest {
  name: string;
}

export interface CreatedUserCredentials {
  name: string;
  username: string;
  password: string;
}

export interface CreateUserFieldError {
  field: string;
  message: string;
  kind?: string;
}

export interface CreateUserResponse {
  status: boolean;
  message: string;
  data: CreatedUserCredentials;
  errors?: CreateUserFieldError[];
  RequestId?: string;
}

export interface CreateUserRejectValue {
  message: string;
  errors: CreateUserFieldError[];
}
