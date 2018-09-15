import React, {Component} from 'react';
// import {Typeahead} from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import recommendations from './data/recommendations';
// import foods from './data/foods';
import * as firestore from './firestore';
import meals from './data/meals';
import FoodInput from './FoodInput';
import FoodList from './FoodList';
import NutrientTable from './NutrientTable';

let foods = {};
let foodOptions = [];

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      initialized: false,
    };

    this.selectFood = this.selectFood.bind(this);
  }

  componentDidMount() {
    firestore.getFoods().then(foodsFromFirestore => {
      foods = foodsFromFirestore;

      foodOptions = Object.keys(foods).map(foodId => ({id: foodId, label: foods[foodId].name}));

      // let selectedFoods = meals[8];
      let selectedFoods = meals[meals.length - 1];
      this.setState({
        selectedFoods: selectedFoods,
        total: this.calculateTotal(selectedFoods),
        initialized: true,
      });
    });


  }

  calculateTotal(selectedFoods) {
    return recommendations.map(recommendation => {
      return selectedFoods.reduce(
          (value, food) => {
            // console.log(food);
            return value + food.amount / 100 *
                foods[food.id].nutrients[recommendation.id];
          },
          0
      );
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
      total: this.calculateTotal(selectedFoods),
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
            <FoodList selectedFoods={this.state.selectedFoods} foods={foods}/>
          </div>
          <div>
            <NutrientTable recommendations={recommendations} total={this.state.total}/>
          </div>
        </div>
    );
  }
}

export default App;
