import { takeLatest, call, put } from 'redux-saga/effects'
import {DefaultAction} from "../reducers";
import {ActionTypes, authenticateSuccessAction, getUserInfoSuccessAction, saveUserInfoSuccessAction} from "../actions";
import api from '../utils/api';

function* authenticate(action: DefaultAction) {
  const authData = yield call(() => api.post('/auth/token', {
    tokenType: 'code',
    token: action.payload
  }));
  yield localStorage.setItem('token', authData.token);
  yield localStorage.setItem('refreshToken', authData.refreshToken);
  yield put(authenticateSuccessAction(authData))
}

function* authenticateRefresh(action: DefaultAction) {
  try {
    const authData = yield call(() => api.post('/auth/token', {
      tokenType: 'refresh',
      token: action.payload
    }));
    yield localStorage.setItem('token', authData.token);
    yield localStorage.setItem('refreshToken', authData.refreshToken);
    yield put(authenticateSuccessAction(authData))
  } catch (e) {
    console.log(e);
  }
}

function* logout() {
  yield localStorage.removeItem('token')
  yield localStorage.removeItem('refreshToken')
}

function* getUserInfo() {
  try {
    const userinfo = yield call(() => api.get('/userinfo'))
    yield put(getUserInfoSuccessAction(userinfo))
  } catch (e) {
    console.log(e);
  }
}

function* saveUserInfo(action: DefaultAction) {
  try {
    const userinfo = yield call(() => api.put('/userinfo', action.payload))
    yield put(saveUserInfoSuccessAction(userinfo))
  } catch (e) {
    console.log(e);
  }
}

function* authSaga(){
  yield takeLatest(ActionTypes.AUTHENTICATE, authenticate);
  yield takeLatest(ActionTypes.AUTHENTICATE_REFRESH, authenticateRefresh);
  yield takeLatest(ActionTypes.LOGOUT, logout);
  yield takeLatest(ActionTypes.GET_USERINFO, getUserInfo);
  yield takeLatest(ActionTypes.SAVE_USERINFO, saveUserInfo);
}

export default authSaga;
