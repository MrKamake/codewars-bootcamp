const GitHubStrategy = require('passport-github').Strategy;
const User = require('../../models/User');
require('dotenv').config();

module.exports = function passport(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, cb) => {
        const hasUser = await User.exists({ user_id: profile.id });
        if (!hasUser) {
          const newUser = new User({
            user_id: profile.id,
            username: profile.username
          });
          await newUser.save();
        }

        return cb(null, profile);
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
};
