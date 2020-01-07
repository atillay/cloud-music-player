import { combineReducers } from 'redux';
import authReducer, {AuthState} from "./auth";
import soundReducer, {SoundState} from "./sound";
import playerReducer, {PlayerState} from "./player";

export interface DefaultAction {
  type: string,
  payload: any
}

export interface AppState {
  auth: AuthState,
  sound: SoundState,
  player: PlayerState,
}

export default combineReducers({
  auth: authReducer,
  sound: soundReducer,
  player: playerReducer
});
