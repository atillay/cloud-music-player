import React from 'react';
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {logoutAction} from "../actions";

const Logout: React.FC<LogoutProps> = (props) => {

  props.logout();

  return (
    <Redirect to={'/'}/>
  )
};

interface LogoutProps {
  logout: () => void
}

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logoutAction),
});

export default connect(null, mapDispatchToProps)(Logout);
