import React from "react";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router";
import {AppState} from "../reducers";
import {connect} from "react-redux";

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ component, fallbackComponent, authenticated, ...rest }) => {
  if (authenticated) {
    return <Route {...rest} component={component}/>
  } else if (fallbackComponent) {
    return <Route {...rest} component={fallbackComponent}/>
  } else {
    return <Redirect to='/'/>
  }
};

interface AuthenticatedRouteProps extends RouteProps {
  fallbackComponent?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
  authenticated: boolean
}

const mapStateToProps = (state: AppState) => ({
  authenticated: state.auth.token !== null,
});

export default connect(mapStateToProps)(AuthenticatedRoute);
