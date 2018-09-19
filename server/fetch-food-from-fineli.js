const fs = require('fs');
// const foods = require('../data/foods');
// const outputFile = '../data/foods.json';
// const outputFile = '../data/new-foods.json';
const fineli = require('./fineli');
const firestore = require('./firestore');

fineli.getFood(process.argv[2]).then(firestore.setFood).then(() => {
  console.log('done');
  process.exit();
});