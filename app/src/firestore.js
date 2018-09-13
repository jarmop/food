import firebase from 'firebase';
import config from './config';

const COLLECTION_FOODS = 'foods';

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
