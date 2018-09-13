let firebase = require('firebase');
let config = require('../config');

const COLLECTION_FOODS = 'foods';

firebase.initializeApp(config.firebase);

let db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

/**
 * @param foods
 * @returns {Promise<void>}
 */
exports.setFoodBatch = (foods) => {
  let batch = db.batch();
  foods.map(food => {
    let foodRef = db.collection(COLLECTION_FOODS).doc(food.id);
    batch.set(foodRef, food);
  });

  return batch.commit();
};

/**
 * @param food
 * @returns {Promise<void>}
 */
exports.setFood = (food) => {
  return db.collection(COLLECTION_FOODS).doc(food.id).set(food);
};