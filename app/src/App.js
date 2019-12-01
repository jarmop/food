import React, {Component} from 'react';
import './App.css';
import * as firestore from './firestore';
import FoodInput from './FoodInput';
import FoodList from './FoodList';
import NutrientData from './NutrientData';
import DatePicker from './DatePicker';

let foods = {};
let foodOptions = [];

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      initialized: false,
      selectedFoods: [],
      mealFoods: [],
      date: new Date(),
    };

    this.addFood = this.addFood.bind(this);
    this.deleteFood = this.deleteFood.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.setMealByDate = this.setMealByDate.bind(this);
  }

  getMealIdByDate(date) {
    return date.toDateString();
  }

  getCurrentMealId() {
    return this.getMealIdByDate(this.state.date);
  }

  componentDidMount() {
    Promise.all([firestore.getFoods(), firestore.getMeal(this.getCurrentMealId())]).then((values) => {
      foods = values[0];
      let meal = values[1];
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
    let mealFoods = [...this.state.mealFoods];

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

    firestore.saveMeal(mealFoods, this.getCurrentMealId());
  }

  deleteFood(foodIds) {
    let mealFoods = this.state.mealFoods.filter(food => !foodIds.includes(food.id));

    this.setState({
      mealFoods: mealFoods,
      selectedFoods: [],
    });

    firestore.saveMeal(mealFoods, this.getCurrentMealId());
  }

  selectFood(selectedFoodId) {
    let selectedFoods = [...this.state.selectedFoods];
    if (selectedFoods.includes(selectedFoodId)) {
      selectedFoods = selectedFoods.filter(foodId => foodId !== selectedFoodId);
    } else {
      selectedFoods.push(selectedFoodId);
    }
    this.setState({
      selectedFoods: selectedFoods,
    });
  }

  toggleAll() {
    this.setState({
      selectedFoods: this.state.mealFoods.length === this.state.selectedFoods.length
          ? []
          : this.state.mealFoods.map(food => food.id),
    });
  }

  setMealByDate(date) {
    firestore.getMeal(this.getMealIdByDate(date)).then(meal => {
      if (!meal) {
        meal = [];
      }
      this.setState({
        mealFoods: meal,
        date: date,
      });
    });
  }

  render() {
    if (!this.state.initialized) {
      return 'not ready';
    }

    return (
        <div className="grid">
          <div>
            <DatePicker
                onDateChange={this.setMealByDate}
            />
            <FoodInput foodOptions={foodOptions} onAdd={this.addFood}/>
            <FoodList
                foods={foods}
                mealFoods={this.state.mealFoods}
                selectedFoods={this.state.selectedFoods}
                onDelete={foodId => this.deleteFood(foodId)}
                onSelect={foodId => this.selectFood(foodId)}
                onToggleAll={this.toggleAll}
            />
          </div>
          <div>
            <NutrientData
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
