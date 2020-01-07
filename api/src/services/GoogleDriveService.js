const {google} = require('googleapis');

class GoogleDriveService {

  constructor(accessToken, refreshToken) {

    this.auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    this.auth.credentials = {
      access_token: accessToken,
      refresh_token: refreshToken
    };

    this.drive = google.drive('v3');

  }

  async listSounds(folderId) {
    return new Promise((resolve, reject) => {
      this.drive.files.list({
        auth: this.auth,
        q: `mimeType='audio/mpeg'`,
        folderId: folderId,
        fields: 'files(id, size)',
        pageSize: 1000,
      }, (err, res) => {
        if (res) {
          resolve(res.data.files);
        } else {
          console.log(err);
        }
      });
    });
  }
}

module.exports = GoogleDriveService;
