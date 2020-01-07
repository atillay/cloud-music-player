import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleWare from 'redux-saga'
import rootReducer from './reducers';
import sagas from './sagas';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const sagaMiddleware = createSagaMiddleWare();

const store = createStore(rootReducer, compose(
  applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

sagaMiddleware.run(sagas);

export default store;
