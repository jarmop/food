const request = require('request');
const fs = require('fs');
const recommendations = require('../data/recommendations');
// const foods = require('../data/foods');
// const outputFile = '../data/foods.json';
// const outputFile = '../data/new-foods.json';
const firestore = require('./firestore');
const kcalToKjRatio = 4.184;


// console.log(foodId);
// process.exit();

const URL = 'https://fineli.fi/fineli/api/v1/foods/[FOOD_ID]';


const mapNutrientIdToFineliDataIndex = {
  1: 50,
  2: 52,
  3: 53,
  4: 47,
  5: 46,
  6: 43,
  7: 45,
  8: 42,
  9: 48,
  10: 49,
  11: 31,
  12: 38,
  13: 34,
  14: 35,
  15: 32,
  16: 40,
  18: 33,
  19: 39,
  21: 3,
  22: 2,
  23: 1,
};

const nutrientIdForEnergy = 20;
const fineliDataIndexForEnergy = 0;

const getFood = (foodId) => {
  return new Promise((resolve, reject) => {
    let url = URL.replace(/\[FOOD_ID\]/, foodId);
    request(url, {json: true}, (error, response, body) => {
      if (error) {
        reject(error);
      }

      let food = {
        id: foodId,
        name: body.name.fi
      };
      let nutrients = {};
      recommendations.map(rec => {
        nutrients[rec.id] = body.data[mapNutrientIdToFineliDataIndex[rec.id]];
      });

      nutrients[nutrientIdForEnergy] = Math.round(body.data[fineliDataIndexForEnergy] / kcalToKjRatio);
      food.nutrients = nutrients;

      resolve(food);
    });
  });
};

const saveFood = (food) => {
  return firestore.setFood(food);
};

getFood(process.argv[2]).then(saveFood).then(() => {
  console.log('done');
  process.exit();
});