const fs = require('fs');
// const foods = require('../data/foods');
// const outputFile = '../data/foods.json';
// const outputFile = '../data/new-foods.json';
const fineli = require('./fineli');
const firestore = require('./firestore');

// fineli.getFood(process.argv[2]).then(firestore.setFood).then(() => {
//   console.log('done');
//   process.exit();
// });

firestore.getFoods()
    .then(foods => Object.keys(foods))
    // .then(foods => foods.slice(0, 1))
    .then(foodIds => {
      console.log('fetching ' + foodIds.length + ' foods from fineli');
      return Promise.all(foodIds.map(foodId => fineli.getFood(foodId)));
    })
    .then(foods => Object.keys(foods).map(foodId => foods[foodId]))
    .then(foodArray => {
      console.log('storing ' + foodArray.length + ' foods to firestore');
      return firestore.setFoods(foodArray);
    })
    // .then(fineliFoods => {
    //   console.log(fineliFoods);
    // })
    .finally(() => {
      console.log('done');
      process.exit();
    });