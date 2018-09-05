const request = require('request');
var fs = require('fs');
const recommendations = require('../data/recommendations');
const foods = require('../data/foods');
let fileName = '../data/foods.json';

let foodId = process.argv[2];

// console.log(foodId);
// process.exit();

let url = 'https://fineli.fi/fineli/api/v1/foods/' + foodId;

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

request(url, {json: true}, (error, response, body) => {
  if (error) {
    return console.log(error);
  }

  let data = {};
  recommendations.map(rec => {
    data[rec.id] = body.data[mapNutrientIdToFineliDataIndex[rec.id]];
  });

  // console.log(JSON.stringify({
  //   name: body.name.fi,
  //   nutrients: data
  // }));

  foods[foodId] = {
    name: body.name.fi,
    nutrients: data
  };
  console.log(JSON.stringify(foods));

  fs.writeFile(fileName, JSON.stringify(foods), error => {
    console.log(body.name.fi + ' added to ' + fileName);
  });
});

