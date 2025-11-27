import { AUTH_SET, AUTH_SIGN_OUT, AUTH_UPDATE_LOCAL_USER } from "./authTypes";

export const setAuth = (payload: {
  user?: any;
  token?: string | null;
  provider?: "google" | "local" | null;
}) => ({
  type: AUTH_SET,
  payload,
});

export const signOut = () => ({
  type: AUTH_SIGN_OUT,
});

export const updateLocalUser = (user: any) => ({
  type: AUTH_UPDATE_LOCAL_USER,
  payload: user,
});
