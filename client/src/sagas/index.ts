import {all} from 'redux-saga/effects'
import auth from './auth';
import sound from "./sound";

function* rootSaga() {
  yield all([
    auth(),
    sound(),
  ]);
}

export default rootSaga;
