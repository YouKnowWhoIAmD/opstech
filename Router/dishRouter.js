const dishRouter = require('express').Router();
const passport = require('passport');
const ObjectId = require('mongoose').Types.ObjectId;
const Dish = require('../Models/Dish');
const passportConfig = require('../passport');

dishRouter.get('/:dishId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { dishId } = req.params;
    console.log(dishId);
    const dish = await Dish.findById(dishId);
    console.log(dish);
    res.send(dish);
  } catch (err) { throw new Error(err); }
});

dishRouter.post('/:dishId/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { dishId } = req.params;
    const dish = await Dish.findById(dishId);

    if (req.body.dishname) dish.dishname = req.body.dishname;
    if (req.body.description) dish.description = req.body.description;
    if (req.body.type) dish.type = req.body.type;
    if (req.body.desert) dish.desert = req.body.desert;
    if (req.body.ingredients) dish.ingredients = req.body.ingredients;

    const updatedDish = await Dish.updateOne({_id: ObjectId(dishId)}, dish);
    if (!updatedDish) return res.status(201).send({error: 'Could not update the dish'})
    res.status(200).send({msg: 'Update successful'});
  } catch (err) { throw new Error(err); }
})

dishRouter.delete('/:dishId/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { dishId } = req.params;
    const deletedDish = await Dish.deleteOne({_id: ObjectId(dishId)});
    if (!deletedDish) return res.status(201).send({error: 'Could not delete the dish'})
    res.status(200).send({msg: 'Delete success'});
  } catch (err) { throw new Error(err); }
})

dishRouter.post('/newdish', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { dishname, description, type, desert, ingredients } = req.body;
    const newDish = new Dish({ dishname, description, type, desert, ingredients });
    await newDish.save();
    res.send(newDish);
  } catch (err) { throw new Error(err); }
})

module.exports = dishRouter;