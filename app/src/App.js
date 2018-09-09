import React, {Component} from 'react';
// import {Typeahead} from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import recommendations from './data/recommendations';
import foods from './data/foods';
import meals from './data/meals';
import FoodInput from './FoodInput';

let total = recommendations.map(recommendation => {
  return foods[153].nutrients[recommendation.id];
});

let foodOptions = Object.keys(foods)
    .map(foodId => ({id: foodId, label: foods[foodId].name}));

class App extends Component {
  constructor(props) {
    super();
    // let selectedFoods = meals[0];
    // let selectedFoods = meals[1];
    // let selectedFoods = meals[2];
    let selectedFoods = meals[3];
    this.state = {
      selectedFoods: selectedFoods,
      total: this.calculateTotal(selectedFoods),
    };

    this.selectFood = this.selectFood.bind(this);
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
    if (selectedFoods.reduce(
        (hasNewFood, food) => newFoodId === food.id), false) {
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

    return (
        <div className="grid">
          <div>
            <FoodInput foodOptions={foodOptions} onAdd={this.selectFood}/>
            <div className="food-list">
              {this.state.selectedFoods.map((selectedFood, index) =>
                  <div key={index}>
                    {foods[selectedFood.id].name}, {selectedFood.amount} g
                  </div>
              )}
            </div>
          </div>
          <div>
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Total</th>
                <th>Recommendation</th>
                <th>Max</th>
                <th>Unit</th>
              </tr>
              </thead>
              <tbody>
              {recommendations.map((recommendation, index) =>
                  <tr key={index}>
                    <td>{recommendation.name}</td>
                    <td>
                      <div className="bar">
                        <div
                            className="bar__fill"
                            style={{
                              width: Math.min(this.state.total[index] /
                                  recommendation.male * 100, 100) + '%'
                            }}
                        ></div>
                      </div>
                      <div className="total-amount">
                        {this.state.total[index].toFixed(1)}
                      </div>
                    </td>
                    <td>
                      {recommendation.male}
                    </td>
                    <td>
                      {recommendation.max}
                    </td>
                    <td>
                      {recommendation.unit}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
    );
  }
}

export default App;
