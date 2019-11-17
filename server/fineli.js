const recommendationsData = require('../data/recommendations');
let recommendations = recommendationsData.basic.concat(recommendationsData.minerals, recommendationsData.vitamins, recommendationsData.fats, recommendationsData.carbs);

const kcalToKjRatio = 4.184;
const URL = 'https://fineli.fi/fineli/api/v1/foods/[FOOD_ID]';
const mapNutrientIdToFineliDataIndex = {
  1: 48,
  2: 52,
  3: 53,
  4: 47,
  5: 46,
  6: 43,
  7: 45,
  8: 42,
  9: 50,
  10: 51,
  11: 31,
  12: 38,
  13: 34,
  14: 35,
  15: 32,
  16: 40,
  18: 33,
  19: 39,
  50: 36,
  51: 37,
  21: 3,
  22: 1,
  23: 2,
  24: 18,
  25: 19,
  26: 20,
  27: 21,
  28: 22,
  29: 23,
  30: 24,
  31: 25,
  32: 26,
  33: 27,
  34: 28,
  35: 29,
  36: 30,
  37: 5,
  38: 6,
  39: 7,
  40: 8,
  41: 9,
  42: 10,
  43: 11,
  44: 12,
  45: 13,
  46: 14,
  47: 15,
  48: 16,
  49: 17,
};

const nutrientIdForEnergy = 20;
const fineliDataIndexForEnergy = 0;

const request = require('request');

exports.getFood = (foodId) => {
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