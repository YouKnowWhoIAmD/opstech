const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('./Models/User');

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  await User.findById({_id: payload.sub}, (err, user) =>{
    if(err) return done(err, false);
    if(!user) return done(null, false);
    return done(null, user);
  })

}))

passport.use('local', new LocalStrategy((username, password, done) => {

  if (!username || !password) {
    return res
      .status(400)
      .send({ error: 'Please provide both a username and a password.' });
  }

  try {
    User.findOne({username}, (err, usere) => {
      if(err) return done(err);
      if(!usere || !usere.password) return done(null, false);
      bcrypt.compare(password, usere.password, (err, match) => {
        if(err) return done(err);
        if(!match) return done(null, false);
        const {_id, username, role} = usere;
        const token = JWT.sign({sub: _id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return done(null, {username, token, role});
      })
    })
  } catch (err) { throw new Error(err);}
}))