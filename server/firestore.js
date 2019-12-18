const firebase = require('firebase');
const config = require('../config');

const COLLECTION_FOODS = 'foods';
const COLLECTION_MEALS = 'meals';

firebase.initializeApp(config.firebase);

const db = firebase.firestore();

/**
 * @param foods
 * @returns {Promise<void>}
 */
exports.setFoods = (foods) => {
  const batch = db.batch();
  foods.forEach(food => {
    const foodRef = db.collection(COLLECTION_FOODS).doc(food.id);
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
      const foods = collection.reduce((foods, doc) => {
        const food = doc.data();
        foods[food.id] = food;
      }, {});

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
  const batch = db.batch();
  meals.forEach(meal => {
    const mealRef = db.collection(COLLECTION_MEALS).doc();
    batch.set(mealRef, {foods: meal});
  });

  return batch.commit();
};