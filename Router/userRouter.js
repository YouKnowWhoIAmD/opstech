const userRouter = require('express').Router();
const passport = require('passport');

const User = require('../Models/User');
const passportConfig = require('../passport');

userRouter.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if( !username || !password || role === null || role === undefined ) 
    res.status(400).send()
  User.findOne({username}, async (err, user) => {
    if(err) return res.status(401).send({errMessage: 'An error occurred'});
    if(user) return res.status(401).send({errMessage: 'Username is taken'});
    const newUser = new User({username, password, role});
    await newUser.save();
    return res.status(200).send({user: { username, role }});
  });
});

userRouter.post('/login', passport.authenticate('local', {session: false}), async (req, res) => {
  if(req.isAuthenticated()) {
    const { username, token, role } = req.user;
    return res.status(200).send({user: { username, role }, token: token});
  }
});

userRouter.post('/checkAuth', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { username, role } = req.user;
  res.send({user: { username, role }, token: req.headers.authorization.replace('Bearer ','')});
})

userRouter.post('/logout', async (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = userRouter;