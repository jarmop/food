const request = require('request');
const recommendations = require('../data/recommendations');

let url = 'https://fineli.fi/fineli/api/v1/foods/153';

var mapNutrientIdToFineliDataIndex = {
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
  19: 39
};

request(url, { json: true }, (error, response, body) => {
  if (error) {
    return console.log(error);
  }

  let data = {};
  recommendations.map(rec => {
    data[rec.id] = body.data[mapNutrientIdToFineliDataIndex[rec.id]];
  });

  console.log(JSON.stringify(data));
});

