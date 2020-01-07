import {Sound} from "../reducers/sound";

export enum ActionTypes {
  AUTHENTICATE = 'AUTHENTICATE',
  AUTHENTICATE_REFRESH = 'AUTHENTICATE_REFRESH',
  AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS',
  LOGOUT = 'LOGOUT',
  GET_USERINFO = 'GET_USERINFO',
  GET_USERINFO_SUCCESS = 'GET_USERINFO_SUCCESS',
  SAVE_USERINFO = 'SAVE_USERINFO',
  SAVE_USERINFO_SUCCESS = 'SAVE_USERINFO_SUCCESS',
  SYNC_SOUNDS = 'SYNC_SOUNDS',
  SYNC_SOUNDS_SUCCESS = 'SYNC_SOUNDS_SUCCESS',
  GET_SOUNDS = 'GET_SOUNDS',
  GET_SOUNDS_SUCCESS = 'GET_SOUNDS_SUCCESS',
  LOAD_PLAYER = 'LOAD_PLAYER',
  LOADED_PLAYER = 'LOADED_PLAYER',
  PLAY_PLAYER = 'PLAY_PLAYER',
  PAUSE_PLAYER = 'PAUSE_PLAYER',
}

export const authenticateAction = (code: string) => ({ type: ActionTypes.AUTHENTICATE, payload: code });
export const authenticateRefreshAction = (refreshToken: string) => ({ type: ActionTypes.AUTHENTICATE_REFRESH, payload: refreshToken });
export const authenticateSuccessAction = (authData: object) => ({ type: ActionTypes.AUTHENTICATE_SUCCESS, payload: authData });

export const logoutAction = { type: ActionTypes.LOGOUT };

export const getUserInfoAction = { type: ActionTypes.GET_USERINFO };
export const getUserInfoSuccessAction = (user: object) => ({ type: ActionTypes.GET_USERINFO_SUCCESS, payload: user });

export const saveUserInfoAction = (user: object) => ({ type: ActionTypes.SAVE_USERINFO, payload: user });
export const saveUserInfoSuccessAction = (user: object) => ({ type: ActionTypes.SAVE_USERINFO_SUCCESS, payload: user });

export const syncSoundsAction = { type: ActionTypes.SYNC_SOUNDS };
export const syncSoundsSuccessAction = { type: ActionTypes.SYNC_SOUNDS_SUCCESS };

export const getSoundsAction = { type: ActionTypes.GET_SOUNDS };
export const getSoundsSuccessAction = (data: Array<any>) => ({ type: ActionTypes.GET_SOUNDS_SUCCESS, payload: data });

export const loadPlayerAction = (sound: Sound) => ({ type: ActionTypes.LOAD_PLAYER, payload: sound });
export const loadedPlayerAction = { type: ActionTypes.LOADED_PLAYER };
export const playPlayerAction = { type: ActionTypes.PLAY_PLAYER };
export const pausePlayerAction = { type: ActionTypes.PAUSE_PLAYER };
