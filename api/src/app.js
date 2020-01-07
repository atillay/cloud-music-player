require('dotenv').config();
require('./config/mongoose');
require('./config/passport');

const mm = require('music-metadata');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const authService = require('./services/AuthService');
const mongoose = require('mongoose');
const GoogleDriveService = require('./services/GoogleDriveService');
const request = require('request-promise');

app.use(cors());

app.use(function(req, res, next) {
  let allowedOrigins = ['*'];
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
});
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

/**
 * Endpoints
 */

app.get('/', (req, res) => {
  res.send('<h1>Cloud Music Player API</h1>');
});

app.get('/auth/google', passport.authenticate('google', {
  session: false,
  accessType: 'offline',
  prompt: 'consent',
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive.readonly'
  ]
}));

app.get('/auth/google/callback/', passport.authenticate('google', {session: false}), (req, res) => {
  const code = authService.generateCode(req.user._id);
  if (!code) {
    res.sendStatus(500);
  }
  res.redirect(process.env.FRONT_CALLBACK_URL.replace('{code}', code));
});

app.post('/auth/token', (req, res) => {
  const token     = req.body.token;
  const tokenType = req.body.tokenType;

  let tokenData;
  try {
    tokenData = authService.validateToken(tokenType, token);
  } catch(e) {
    res.status(401).send({error: e.message})
  }

  switch (tokenType) {
    case 'code':
      res.json({
        token: authService.generateToken(tokenData.id),
        refreshToken: authService.generateRefreshToken(tokenData.id),
      });
      break;
    case 'refresh':
      res.json({
        token: authService.generateToken(tokenData.id),
        refreshToken: token,
      });
      break;
    default:
      res.sendStatus(500);
  }
});

app.get('/userinfo', authService.validTokenMiddleware, async (req, res) => {
  const user = await mongoose.model('User').findById(req.authData.id);
  res.json(user);
});

app.put('/userinfo', authService.validTokenMiddleware, async (req, res) => {
  await mongoose.model('User').findByIdAndUpdate(req.authData.id, req.body);
  const updatedUser = await mongoose.model('User').findById(req.authData.id);
  res.json(updatedUser);
});

app.get('/sounds/sync', authService.validTokenMiddleware, async (req, res) => {
  const user          = await mongoose.model('User').findById(req.authData.id);
  const driveService  = new GoogleDriveService(user.googleToken, user.googleRefreshToken);
  const driveSounds   = await driveService.listSounds(user.googleFolderId);
  const currentSounds = await mongoose.model('Sound').find({owner: req.authData.id}).select('googleId').distinct('googleId');

  for (let i = 0; i < driveSounds.length; i++) {

    // Sound does not exist
    if (currentSounds.indexOf(driveSounds[i].id) === -1) {

      const url = `https://www.googleapis.com/drive/v3/files/${driveSounds[i].id}?bytes=0-999&access_token=${user.googleToken}&key=${process.env.DEVELOPER_KEY}&alt=media`;

      const partialSound = await request({
        uri: url,
        encoding: null,
        headers: {'Range': 'bytes=0-500000'} // get only first 0,5mb
      });

      const metadata = await mm.parseBuffer(partialSound, 'audio/mpeg', {
        fileSize: 100000,
        skipCovers: true,
      });

      if (!metadata.common.title) {
        console.error('Failed extract metadata of : ' + driveSounds[i].id)
      }
      else {
        await mongoose.model('Sound').create({
          googleId: driveSounds[i].id,
          owner: user.id,
          duration: metadata.format.duration,
          title: metadata.common.title,
          artist: metadata.common.artist,
          bpm: metadata.common.bpm ? parseInt(metadata.common.bpm) : null,
          key: metadata.common.key,
          year: metadata.common.year,
          genre: Array.isArray(metadata.common.genre) && metadata.common.genre.length > 0 ? metadata.common.genre[0] : null,
        });
        console.log('Added: ' + metadata.common.title);
      }
    }
  }
  res.json({success: true});
});

app.get('/sounds', authService.validTokenMiddleware, async (req, res) => {
  const sounds = await mongoose.model('Sound').find({owner: req.authData.id});
  res.json(sounds);
});

app.get('/sounds/stream/:googleId', authService.validTokenMiddleware, async (req, res) => {
  const googleToken  = await mongoose.model('User').findById(req.authData.id).distinct('googleToken');
  const googleId     = req.params.googleId;
  const developerKey = req.query.key;

  const streamUrl = 'https://www.googleapis.com/drive/v3/files/' + googleId +
    '?access_token=' + googleToken + '&key=' + developerKey + '&alt=media';

  await request({
    uri: streamUrl,
    followRedirect: false,
  }).then((a) => {
  }).catch(e => {
    if (e.statusCode === 307) {
      res.redirect(e.response.headers.location);
    }
    else {
      console.log(e.statusCode)
      console.log(e.response.headers)
    }
  });
});

app.listen(process.env.SERVER_PORT, function() {
  console.log('Express app listening on port ' + process.env.SERVER_PORT);
});
