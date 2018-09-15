import React, {Component} from 'react';
// import {Typeahead} from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import * as firestore from './firestore';
import FoodInput from './FoodInput';
import FoodList from './FoodList';
import NutrientTable from './NutrientTable';

let foods = {};
let foodOptions = [];

const getFoods = () => {
  return firestore.getFoods();
};

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      initialized: false,
    };

    this.selectFood = this.selectFood.bind(this);
  }

  componentDidMount() {
    Promise.all([firestore.getFoods(), firestore.getMeals()]).then((values) => {
      foods = values[0];
      let meals = values[1];

      foodOptions = Object.keys(foods).map(foodId => ({id: foodId, label: foods[foodId].name}));

      // let selectedFoods = meals[8];
      let selectedFoods = meals[meals.length - 1];
      this.setState({
        selectedFoods: selectedFoods,
        initialized: true,
      });
    });

  }

  selectFood(newFoodId, amount) {
    let selectedFoods = this.state.selectedFoods.slice();
    if (selectedFoods.reduce((hasNewFood, food) => newFoodId === food.id, false)) {
      return;
    }

    selectedFoods.push({
      id: newFoodId,
      amount: amount,
    });

    this.setState({
      selectedFoods: selectedFoods,
    });

    console.log(JSON.stringify(selectedFoods));
  }

  render() {
    // console.log(this.state.selectedFoods);
    if (!this.state.initialized) {
      return 'not ready';
    }

    return (
        <div className="grid">
          <div>
            <FoodInput foodOptions={foodOptions} onAdd={this.selectFood}/>
            <FoodList foods={foods} selectedFoods={this.state.selectedFoods}/>
          </div>
          <div>
            <NutrientTable foods={foods} selectedFoods={this.state.selectedFoods}/>
          </div>
        </div>
    );
  }
}

export default App;
