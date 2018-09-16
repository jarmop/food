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
      selectedFood: null,
      selectedFoods: [],
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
        selectedFoods: meal,
        initialized: true,
      });
    });

  }

  addFood(newFoodId, amount) {
    let selectedFoods = this.state.selectedFoods.slice();

    let foodAlreadySelected = false;
    selectedFoods = selectedFoods.map(food => {
      if (newFoodId === food.id) {
        foodAlreadySelected = true;
        return {
          id: food.id,
          amount: food.amount + amount,
        }
      }
      return food;
    });

    if (!foodAlreadySelected) {
      selectedFoods.push({
        id: newFoodId,
        amount: amount,
      });
    }

    this.setState({
      selectedFoods: selectedFoods,
    });

    firestore.saveMeal(selectedFoods, mealId);
  }

  deleteFood(foodId) {
    let selectedFoods = this.state.selectedFoods.filter(food => foodId !== food.id);

    this.setState({
      selectedFoods: selectedFoods,
    });

    firestore.saveMeal(selectedFoods, mealId);
  }

  selectFood(foodId) {
    this.setState({
      selectedFood: foodId,
    });
  }

  render() {
    // console.log(this.state.selectedFoods);
    if (!this.state.initialized) {
      return 'not ready';
    }

    return (
        <div className="grid">
          <div>
            <FoodInput foodOptions={foodOptions} onAdd={this.addFood}/>
            <FoodList
                foods={foods}
                selectedFoods={this.state.selectedFoods}
                onDelete={foodId => this.deleteFood(foodId)}
                onSelect={foodId => this.selectFood(foodId)}
            />
          </div>
          <div>
            <NutrientTable
                foods={foods}
                mealFoods={this.state.selectedFoods}
                selectedFood={this.state.selectedFood}
            />
          </div>
        </div>
    );
  }
}

export default App;
