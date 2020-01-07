import React from 'react';
import AudioPlayer from "../components/AudioPlayer";
import {AppState} from "../reducers";
import {getUserInfoAction} from "../actions";
import {connect} from "react-redux";
import {UserInfo} from "../reducers/auth";
import {Button, Dropdown, Icon, Menu} from "antd";
import {Link} from "react-router-dom";


const LayoutAuthenticated: React.FC<AuthenticatedLayoutProps> = (props) => {

  if (Object.keys(props.user).length === 0) {
    props.getUserInfo();
    return (
      <div className="centered-loader">
        <Icon type="loading" />
      </div>
    )
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to={'/settings'}>
          <Icon type="setting" /> Settings
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={'/logout'}>
          <Icon type="logout" /> Logout
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="layout-authenticated">
      <header className="main-header">
        <div className="container">
          <nav className="main-nav">
            <div className="logo">
              <Link to={'/'}>
                <Icon type="play-circle" style={{marginRight: '4px'}}/> Cloud Music Player
              </Link>
            </div>
            <div className="user">
              <Dropdown overlay={menu}>
                <Button ghost>
                  {props.user.firstName} <Icon type="user" />
                </Button>
              </Dropdown>
            </div>
          </nav>
        </div>
      </header>
      <section className="container">
        <div className="main-content">
          {props.children}
        </div>
      </section>
      <footer>
        <AudioPlayer/>
      </footer>
    </div>
  )
};

interface AuthenticatedLayoutProps {
  user: UserInfo,
  getUserInfo: () => void
}

const mapStateToProps = (state: AppState) => ({
  authenticated: state.auth.token !== null,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserInfo: () => dispatch(getUserInfoAction),
});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAuthenticated);
