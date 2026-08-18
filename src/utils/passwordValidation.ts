export const PASSWORD_MIN_LENGTH = 8;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/\d/.test(password)) errors.push("one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("one special character");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getPasswordValidationMessage = (password: string): string => {
  const { errors } = validatePassword(password);
  return errors.length > 0 ? `Password must include ${errors.join(", ")}.` : "";
};
