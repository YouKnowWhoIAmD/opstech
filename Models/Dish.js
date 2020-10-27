const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  dishname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: Boolean,
    required: true,
  },
  desert: {
    type: String,
    required: true
  },
  ingredients: [
    {
      name: String,
      quantity: Number,
      units: Number
    }
  ]
});

module.exports = mongoose.model('Dish', DishSchema);