import React from 'react';
import LayoutAuthenticated from "../components/LayoutAuthenticated";
import {AppState} from "../reducers";
import {connect} from "react-redux";
import {UserInfo} from "../reducers/auth";
import FolderPicker from "../components/FolderPicker";
import {syncSoundsAction} from "../actions";
import {Button, Descriptions, Divider, Icon} from "antd";

const Settings: React.FC<SettingsProps> = ({user, syncSounds, syncLoading}) => {

  return (
    <LayoutAuthenticated>

      <h2>Settings</h2>
      <Descriptions bordered column={{xs: 1, sm: 1, md: 1, lg: 1}}>
        <Descriptions.Item label="Synchronisation folder">
          <p>Choose a folder that contain your musics on your Google Drive account</p>
          <FolderPicker googleToken={user.googleToken}/>
        </Descriptions.Item>
        <Descriptions.Item label="Synchronisation task">
          <p>Launch synchronisation to go through your music folder again</p>
          <Button disabled={syncLoading} onClick={syncSounds} type="primary" ghost>
            Sync sounds {syncLoading && <Icon type="loading" />}
          </Button>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <h2>Account informations</h2>
      <Descriptions bordered column={{sm: 1, md: 2}}>
        <Descriptions.Item label="FirstName">{user.firstName}</Descriptions.Item>
        <Descriptions.Item label="LastName">{user.lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Google ID">{user.googleId}</Descriptions.Item>
      </Descriptions>

      <br/>

      <Button type="danger"><Icon type="exclamation-circle"/>Delete my account</Button>

    </LayoutAuthenticated>
  )
};

interface SettingsProps {
  authenticated: boolean,
  user: UserInfo,
  syncSounds: () => void,
  syncLoading: boolean,
}

const mapStateToProps = (state: AppState) => ({
  authenticated: state.auth.token !== null,
  user: state.auth.user,
  syncLoading: state.sound.syncLoading
});

const mapDispatchToProps = (dispatch: any) => ({
  syncSounds: () => dispatch(syncSoundsAction),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

