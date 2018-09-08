const request = require('request');
const fs = require('fs');
const recommendations = require('../data/recommendations');
const foods = require('../data/foods');
const outputFile = '../data/foods.json';
// const outputFile = '../data/new-foods.json';
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
  6: 44,
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


// let foodIds = Object.keys(foods);
let foodIds = [
  '153',
  '300',
  '346',
  '352',
  '353',
  '423',
  '440',
  '829',
  '4401',
  '4404',
  '7871',
  '11072',
  '28941',
  '29771',
  '29772',
  '30209',
  '30210',
  '30382',
  '30394',
  '30617',
  '33569',
  '34972',
  '35188'
];

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
  // console.log(JSON.stringify({
//   name: body.name.fi,
//   nutrients: data
// }));

  foods[food.id] = food;
  // console.log(foods);
  console.log(JSON.stringify(foods));

  fs.writeFile(outputFile, JSON.stringify(foods), error => {
    console.log(food.name + ' added to ' + outputFile);
  });
};

const addFoodData = (foodId) => {
  getFood(foodId)
      .then(saveFood)
      .catch(error => console.log(error));
};

// foodIds.map(foodId => addFoodData(foodId));
addFoodData(process.argv[2]);