const apiRouter = require('express').Router();

const userRouter = require('./userRouter');
const mealRouter = require('./mealRouter');
const dishRouter = require('./dishRouter');

apiRouter.use('/user', userRouter);
apiRouter.use('/meal', mealRouter);
apiRouter.use('/dish', dishRouter);

module.exports = apiRouter;