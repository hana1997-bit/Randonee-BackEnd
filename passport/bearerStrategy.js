const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/users');

passport.use(new BearerStrategy(
  async (token, done) => {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // console.log(decoded);
      const user = await User.findById(decoded._id);
      if (!user) {
        return done(null, false);
      }
      else{
        return done(null, user, { scope: 'all' });
      }
    } catch (error) {
      console.log(error);
    };

  }
));
