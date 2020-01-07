import React from 'react';
import {getenv} from "../utils/helpers";
import GooglePicker from "react-google-picker";
import {saveUserInfoAction} from "../actions";
import {connect} from "react-redux";
import {Button} from "antd";

const FolderPicker: React.FC<FolderPickerProps> = ({googleToken, saveUserInfo}) => {
  return (
    <GooglePicker
      clientId={getenv('REACT_APP_GOOGLE_CLIENT_ID')}
      developerKey={getenv('REACT_APP_GOOGLE_DEVELOPER_KEY')}
      multiselect={false}
      authImmediate={true}
      mimeTypes={['application/vnd.google-apps.folder']}
      viewId={'DOCS'}
      createPicker={(google: any) => {
        const viewType = google.picker.ViewId.DOCS;
        const view = new google.picker.DocsView(viewType)
          .setMimeTypes('application/vnd.google-apps.folder')
          .setSelectFolderEnabled(true);

        const picker = new window.google.picker.PickerBuilder()
          .addView(view)
          .setOAuthToken(googleToken)
          .setCallback((data: any) => {
            if (data.docs && data.docs.length > 0) {

              const folderId = data.docs[0].id;

              saveUserInfo({
                googleFolderId: folderId
              })
            }
          });
        picker.build().setVisible(true);
      }}>
      <Button type="primary" ghost>Pick a folder</Button>
    </GooglePicker>
  )
};

interface FolderPickerProps {
  googleToken: string
  saveUserInfo: (userInfo: object) => void
}

const mapDispatchToProps = (dispatch: any) => ({
  saveUserInfo: (userInfo: object) => dispatch(saveUserInfoAction(userInfo)),
});

export default connect(null, mapDispatchToProps)(FolderPicker);
