import {DefaultAction} from "./index";
import {ActionTypes} from "../actions";

export interface Sound {
  [key: string]: any
}

export interface SoundState {
  list: Array<Sound>,
  listFetched: boolean,
  syncLoading: boolean,
}
const INITIAL_STATE: SoundState = {
  list: [],
  listFetched: false,
  syncLoading: false,
};

export default (state = INITIAL_STATE, action: DefaultAction) => {
  switch (action.type) {
    case ActionTypes.SYNC_SOUNDS:
      return {...state, list: [], syncLoading: true};
    case ActionTypes.SYNC_SOUNDS_SUCCESS:
      return {...state, list: [], syncLoading: false};
    case ActionTypes.GET_SOUNDS:
      return {...state, listFetched: false};
    case ActionTypes.GET_SOUNDS_SUCCESS:
      return {...state, list: action.payload, listFetched: true};
    default:
        return state;
  }
}
