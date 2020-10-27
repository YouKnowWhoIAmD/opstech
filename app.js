const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apiRouter = require('./Router');

const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

(async function () {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to Database')
  } catch(err) {
    throw new Error(err);
  }
})();

app.listen(5000, () => {
  console.log('Started')
})