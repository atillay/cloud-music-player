import { takeLatest, call, put } from 'redux-saga/effects'
import {ActionTypes, getSoundsSuccessAction, syncSoundsSuccessAction} from "../actions";
import api from '../utils/api';

function* syncSounds() {
  yield call(() => api.get('/sounds/sync'))
  yield put(syncSoundsSuccessAction)
}

function* getSounds() {
  try {
    const sounds = yield call(() => api.get('/sounds'))
    yield put(getSoundsSuccessAction(sounds))
  } catch (e) {
    console.log(e);
  }
}

function* soundSaga(){
  yield takeLatest(ActionTypes.SYNC_SOUNDS, syncSounds);
  yield takeLatest(ActionTypes.GET_SOUNDS, getSounds);
}

export default soundSaga;
