const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const refresh = require("passport-oauth2-refresh");

const  strategy = new GoogleStrategy(
  {
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  async (accessToken, refreshToken, profile, done) => {
    const User = mongoose.model('User');

    const email     = profile.emails[0].value;
    const googleId  = profile.id;
    const firstName = profile.name.givenName;
    const lastName  = profile.name.familyName;

    // Create a new user if not exist
    if (!await User.findOne({ googleId: googleId })) {
      await new User({
        email: email,
        googleId: googleId,
        firstName: firstName,
        lastName: lastName,
      }).save();
    }

    // Update user
    await User.updateOne({googleId: googleId }, {
      googleToken: accessToken,
      googleRefreshToken: refreshToken,
      firstName: firstName,
      lastName: lastName,
    });

    const user = await User.findOne({ googleId: googleId });

    // Return user
    done(null, user);
  }
);

passport.use(strategy);
refresh.use(strategy);
