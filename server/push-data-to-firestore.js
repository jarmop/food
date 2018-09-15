const foods = require('../data/foods');
const meals = require('../data/meals');
const firestore = require('./firestore');

foodArray = Object.keys(foods).map(foodId => foods[foodId]);

// firestore.setFoods(foodArray).then(() => {
//   console.log('done');
//   process.exit();
// });

firestore.setMeals(meals.meals).then(() => {
  console.log('done');
  process.exit();
});