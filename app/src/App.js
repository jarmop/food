import React, {Component} from 'react';
// import {Typeahead} from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
// import meals from './data/meals';
import * as firestore from './firestore';
import FoodInput from './FoodInput';
import FoodList from './FoodList';
import NutrientTable from './NutrientTable';

let foods = {};
let foodOptions = [];
// let mealId = 'dwHwMXq8iSrGgsf8kFbi';
let mealId = (new Date()).toDateString();

const getFoods = () => {
  return firestore.getFoods();
};

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      initialized: false,
      selectedFoods: [],
      mealFoods: [],
    };

    this.addFood = this.addFood.bind(this);
    this.deleteFood = this.deleteFood.bind(this);
  }

  componentDidMount() {
    Promise.all([firestore.getFoods(), firestore.getMeals(), firestore.getMeal(mealId)]).then((values) => {
      foods = values[0];
      // let meals = values[1];
      let meal = values[2];
      if (!meal) {
        meal = [];
      }

      foodOptions = Object.keys(foods).map(foodId => ({id: foodId, label: foods[foodId].name}));

      this.setState({
        mealFoods: meal,
        initialized: true,
      });
    });

  }

  addFood(newFoodId, amount) {
    let mealFoods = this.state.mealFoods.slice();

    let foodAlreadyAdded = false;
    mealFoods = mealFoods.map(food => {
      if (newFoodId === food.id) {
        foodAlreadyAdded = true;
        return {
          id: food.id,
          amount: food.amount + amount,
        }
      }
      return food;
    });

    if (!foodAlreadyAdded) {
      mealFoods.push({
        id: newFoodId,
        amount: amount,
      });
    }

    this.setState({
      mealFoods: mealFoods,
    });

    firestore.saveMeal(mealFoods, mealId);
  }

  deleteFood(foodId) {
    let mealFoods = this.state.mealFoods.filter(food => foodId !== food.id);

    this.setState({
      mealFoods: mealFoods,
    });

    firestore.saveMeal(mealFoods, mealId);
  }

  selectFood(selectedFoodId) {
    let selectedFoods = this.state.selectedFoods.slice();
    if (selectedFoods.includes(selectedFoodId)) {
      selectedFoods = selectedFoods.filter(foodId => foodId !== selectedFoodId);
    } else {
      selectedFoods.push(selectedFoodId);
    }
    this.setState({
      selectedFoods: selectedFoods,
    });
  }

  render() {
    // console.log(this.state.mealFoods);
    if (!this.state.initialized) {
      return 'not ready';
    }

    return (
        <div className="grid">
          <div>
            <FoodInput foodOptions={foodOptions} onAdd={this.addFood}/>
            <FoodList
                foods={foods}
                mealFoods={this.state.mealFoods}
                selectedFoods={this.state.selectedFoods}
                onDelete={foodId => this.deleteFood(foodId)}
                onSelect={foodId => this.selectFood(foodId)}
            />
          </div>
          <div>
            <NutrientTable
                foods={foods}
                mealFoods={this.state.mealFoods}
                selectedFoods={this.state.selectedFoods}
            />
          </div>
        </div>
    );
  }
}

export default App;
