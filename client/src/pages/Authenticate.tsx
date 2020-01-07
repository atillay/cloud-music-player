import React from 'react';
import {connect} from "react-redux";
import {authenticateAction} from "../actions";
import {Redirect, useParams} from "react-router";

const Authenticate: React.FC<AuthenticateProps> = (props) => {

  const {token} = useParams<{token: string}>();

  props.authenticate(token);

  return (
    <Redirect to={'/'}/>
  );
};

interface AuthenticateProps {
  authenticate: (token: string) => void
}

const mapDispatchToProps = (dispatch: any) => ({
  authenticate: (token: string) => dispatch(authenticateAction(token)),
});

export default connect(null, mapDispatchToProps)(Authenticate);
