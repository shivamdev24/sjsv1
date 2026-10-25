export type AuthActionState = {
  success: boolean;
  message: string;
};

export const initialRegisterState: AuthActionState = {
  success: false,
  message: "",
};

export const initialLoginState: AuthActionState = {
  success: false,
  message: "",
};

export const initialResendVerificationState: AuthActionState = {
  success: false,
  message: "",
};
