const mealRouter = require('express').Router();
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');

const Meal = require('../Models/Meal');
const passportConfig = require('../passport');

mealRouter.get('/allmeals', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const allItems = await Meal.aggregate([
      {
        $lookup: {
          from: 'dishes',
          let: {dishId: '$dishes.dish'},
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$_id', '$$dishId'] },
              },
            },
          ],
          as: 'dishes',
        },
      },
      {
        $unset: [
          'dishes.type',
          'dishes.desert',
          'dishes.ingredients'
        ]
      },
    ]);
    res.send(allItems);
  } catch (err) { throw new Error(err); }
})

mealRouter.get('/:mealId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { mealId } = req.params;
    const mealItem = await Meal.aggregate([
      {
        $match: { _id : ObjectId(mealId) }
      },
      {
        $lookup: {
          from: 'dishes',
          let: {dishId: '$dishes.dish'},
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$_id', '$$dishId'] },
              },
            },
          ],
          as: 'dishes',
        },
      },
    ])
    
    if(!mealItem) return res.status(404).send({error: 'Could not find a meal with the given Id'})

    res.send(mealItem[0]);
  } catch (err) { throw new Error(err); }
})

mealRouter.post('/newmeal', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { mealname, price, cuisine, photo, veg, timeToCook, dishes } = req.body;
    if ( !mealname || !price || !cuisine || !photo || !veg || !timeToCook || !dishes ) {
      res.status(400)
        .send({error: 'Please provide all the fields for the meal to create'})
    }
    const newMeal = new Meal({ mealname, price, cuisine, photo, veg, timeToCook, dishes });
    await newMeal.save();
    res.send(newMeal);
  } catch (err) { throw new Error(err); }
})

mealRouter.post('/:mealId/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { mealId } = req.params;

    const oldMeal = await Meal.findById(mealId);
    if( !oldMeal ) res.status(400).send({ error: 'Could not find a meal with the given Id' });

    if(req.body.mealname) oldMeal.mealname = req.body.mealname;
    if(req.body.price) oldMeal.price = req.body.price;
    if(req.body.cuisine) oldMeal.cuisine = req.body.cuisine;
    if(req.body.photo) oldMeal.photo = req.body.photo;
    if(req.body.veg) oldMeal.veg = req.body.veg;
    if(req.body.timeToCook) oldMeal.timeToCook = req.body.timeToCook;

    const meal = await Meal.updateOne({_id: Object(mealId)}, oldMeal);

    if(!meal.nModified) return res.status(201).send({ error: 'Could not update the meal' })
    res.status(200).send({msg: 'Update success', type: 'Update'});
  } catch (err) { throw new Error(err); }
  
})

mealRouter.post('/:mealId/savedishes', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { mealId } = req.params;
    const { dishes } = req.body;
    if(dishes.length != 3) return res.status(401).send({error: 'Please provide 3 dishes'})
    const meal = await Meal.updateOne({_id: Object(mealId)}, { $push: {dishes: {$each: dishes}} });
    if(!meal.nModified) return res.status(201).send({ error: 'Could not update the meal' })
    res.status(200).send({msg: 'Update success', type: 'Update'});
  } catch (err) { throw new Error(err); }
})

mealRouter.delete('/:mealId/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { mealId } = req.params;
    const meal = await Meal.deleteOne({_id: ObjectId(mealId)});
    if(!meal.nModified) return res.status(201).send({ error: 'Could not delete the meal' })
    res.status(200).send({msg: 'Delete success', type: 'Delete'});
  } catch (err) { throw new Error(err); }
})

mealRouter.get('/:mealId/getdishes', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { mealId } = req.params;
    const dishesId = await Meal.aggregate([
      {
        $match: { _id : ObjectId(mealId) }
      },
      {
        $lookup: {
          from: 'dishes',
          let: {dishId: '$dishes.dish'},
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$_id', '$$dishId'] },
              },
            },
          ],
          as: 'dishes',
        },
      },
      {
        $project: {
          "dishes._id": 1
        }
      }
    ]);
    res.send(dishesId[0]["dishes"]);
  } catch (err) { throw new Error(err); }
  
})

module.exports = mealRouter;