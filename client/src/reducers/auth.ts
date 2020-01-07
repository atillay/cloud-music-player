import {DefaultAction} from "./index";
import {ActionTypes} from "../actions";

export interface UserInfo {
  [key: string]: any
}

export interface AuthState {
  token: string|null,
  refreshToken: string|null,
  refreshTokenLoading: boolean,
  user: UserInfo,
}
const INITIAL_STATE: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  refreshTokenLoading: false,
  user: {}
};

export default (state = INITIAL_STATE, action: DefaultAction) => {
  switch (action.type) {
    case ActionTypes.AUTHENTICATE_REFRESH:
      return {...state, token: action.payload.token, refreshTokenLoading: true };
    case ActionTypes.AUTHENTICATE_SUCCESS:
      return {...state, token: action.payload.token, refreshToken: action.payload.refreshToken, refreshTokenLoading: false };
    case ActionTypes.GET_USERINFO_SUCCESS:
      return {...state, user: action.payload };
    case ActionTypes.SAVE_USERINFO_SUCCESS:
      return {...state, user: action.payload };
    case ActionTypes.LOGOUT:
      return {...state, token: null };
    default:
        return state;
  }
}
