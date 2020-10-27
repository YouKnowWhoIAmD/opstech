const mongoose = require('mongoose')

const MealSchema = new mongoose.Schema({
  mealname: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  veg: {
    type: Boolean,
    required: true
  },
  timeToCook: {
    type: Number,
    required: true
  },
  dishes: [{
    dish: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dish'
    }
  }]
});

module.exports = mongoose.model('Meal', MealSchema);