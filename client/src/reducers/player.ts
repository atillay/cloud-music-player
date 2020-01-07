import {DefaultAction} from "./index";
import {ActionTypes} from "../actions";
import {Sound} from "./sound";
import {getAudioDom} from "../utils/helpers";

export interface PlayerState {
  sound: Sound|null,
  loading: boolean,
  playing: boolean,
  audioDom: HTMLAudioElement|null
}
const INITIAL_STATE: PlayerState = {
  sound: null,
  loading: false,
  playing: false,
  audioDom: getAudioDom()
};

export default (state = INITIAL_STATE, action: DefaultAction) => {
  switch (action.type) {
    case ActionTypes.LOAD_PLAYER:
      return {...state, sound: action.payload, loading: true};
    case ActionTypes.LOADED_PLAYER:
      return {...state, loading: false, playing: true};
    case ActionTypes.PLAY_PLAYER:
      return {...state, playing: true};
    case ActionTypes.PAUSE_PLAYER:
      return {...state, playing: false};
    default:
        return state;
  }
}
