import 'antd/dist/antd.css';
import './scss/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import store from './store';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Authenticate from "./pages/Authenticate";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <AuthenticatedRoute exact path="/" component={Home} fallbackComponent={Login}/>
        <AuthenticatedRoute exact path="/settings" component={Settings}/>
        <Route exact path="/logout" component={Logout}/>
        <Route exact path="/authenticate/:token" component={Authenticate}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
