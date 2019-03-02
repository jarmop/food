let firebase = require('firebase');
let config = require('../config');

const COLLECTION_FOODS = 'foods';
const COLLECTION_MEALS = 'meals';

firebase.initializeApp(config.firebase);

let db = firebase.firestore();

db.settings({
  // timestampsInSnapshots: true
});

/**
 * @param foods
 * @returns {Promise<void>}
 */
exports.setFoods = (foods) => {
  let batch = db.batch();
  foods.map(food => {
    let foodRef = db.collection(COLLECTION_FOODS).doc(food.id);
    batch.set(foodRef, food);
  });

  return batch.commit();
};

/**
 * @returns {Promise<any>}
 */
exports.getFoods = () => {
  return new Promise((resolve, reject) => {
    db.collection(COLLECTION_FOODS).get().then(collection => {
      let foods = {};
      collection.forEach(doc => {
        let food = doc.data();
        foods[food.id] = food;
      });

      resolve(foods);
    })
  });
};

/**
 * @param food
 * @returns {Promise<void>}
 */
exports.setFood = (food) => {
  return db.collection(COLLECTION_FOODS).doc(food.id).set(food);
};

exports.setMeals = (meals) => {
  let batch = db.batch();
  meals.map(meal => {
    let mealRef = db.collection(COLLECTION_MEALS).doc();
    batch.set(mealRef, {foods: meal});
  });

  return batch.commit();
};