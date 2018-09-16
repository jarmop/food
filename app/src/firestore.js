import firebase from 'firebase';
import config from './config';

const COLLECTION_FOODS = 'foods';
const COLLECTION_MEALS = 'meals';

firebase.initializeApp(config.firebase);

let db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

/**
 * @returns {Promise<any>}
 */
export const getFoods = () => {
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
 * @returns {Promise<any>}
 */
export const getMeals = () => {
  return new Promise((resolve, reject) => {
    db.collection(COLLECTION_MEALS).get().then(collection => {
      let meals = [];
      collection.forEach(doc => {
        let meal = doc.data();
        meals.push(meal.foods);
      });

      resolve(meals);
    })
  });
};

/**
 * @param mealId
 * @returns {Promise<any>}
 */
export const getMeal = (mealId) => {
  let meal = null;
  return new Promise((resolve, reject) => {
    db.collection(COLLECTION_MEALS).doc(mealId).get().then(doc => {
      if (doc.exists) {
        meal = doc.data().foods;
      }

      resolve(meal);
    })
  });
};

export const saveMeal = (meal, mealId) => {
  db.collection(COLLECTION_MEALS).doc(mealId).set({
    foods: meal
  });
};