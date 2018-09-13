const foods = require('../data/foods');
const firestore = require('./firestore');

foodArray = Object.keys(foods).map(foodId => foods[foodId]);

firestore.setFoodBatch(foodArray).then(() => {
  console.log('done');
  process.exit();
});