import { AUTH_SET, AUTH_SIGN_OUT, AUTH_UPDATE_LOCAL_USER } from "./authTypes";

const initialState = {
  user: null,        
  token: null,       
  provider: null,    
};

export default function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case AUTH_SET:
      return {
        ...state,
        user: action.payload.user || null,
        token: action.payload.token || null,
        provider: action.payload.provider || null,
      };

    case AUTH_UPDATE_LOCAL_USER:
      return {
        ...state,
        user: action.payload,
      };

    case AUTH_SIGN_OUT:
      return { ...initialState };

    default:
      return state;
  }
}
