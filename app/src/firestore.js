import firebase from 'firebase';
import config from './config';

const COLLECTION_FOODS = 'foods';
const COLLECTION_MEALS = 'meals';

firebase.initializeApp(config.firebase);

const db = firebase.firestore();

/**
 * @returns {Promise<object>}
 */
export const getFoods = () => {
  return new Promise((resolve, reject) => {
    db.collection(COLLECTION_FOODS).get().then(collection => {
      const foods = {};
      collection.forEach(doc => {
        const food = doc.data();
        foods[food.id] = food;
      });

      resolve(foods);
    })
  });
};

/**
 * @returns {Promise<array>}
 */
export const getMeals = () => {
  return new Promise((resolve, reject) => {
    db.collection(COLLECTION_MEALS).get().then(collection => {
      const meals = [];
      collection.forEach(doc => {
        const meal = doc.data();
        meals.push(meal.foods);
      });

      resolve(meals);
    })
  });
};

/**
 * @param mealId
 * @returns {Promise<array>}
 */
export const getMeal = (mealId) => {
  return new Promise((resolve, reject) => {
    db.collection(COLLECTION_MEALS).doc(mealId).get().then(doc => {
      resolve(doc.exists ? doc.data().foods : []);
    })
  });
};

export const saveMeal = (meal, mealId) => {
  db.collection(COLLECTION_MEALS).doc(mealId).set({
    foods: meal
  });
};