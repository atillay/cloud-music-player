import React from 'react';
import LayoutPublic from "../components/LayoutPublic";
import {getenv} from "../utils/helpers";
import {Button, Icon} from "antd";

const Login: React.FC<LoginProps> = () => {
  return (
    <LayoutPublic>
      <div className="login">
        <p>
          <b>Google Drive music player for the web</b><br/>
          After connecting with your Google account, you will be able to select a folder of your drive.
          Our app will then go through all your mp3 in the selected folder and index them.
          You'll then be able to play them on our beautiful interface !
        </p>
        <div className="centered">
          <Button className="login-button" type="primary" size="large" href={`${getenv('REACT_APP_API_URL')}/auth/google`}>
            <Icon type="google" /> Se connecter avec Google
          </Button>
        </div>
      </div>
    </LayoutPublic>
  )
};

interface LoginProps {}

export default Login;
