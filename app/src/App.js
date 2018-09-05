import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import recommendations from './data/recommendations';
import foods from './data/foods';

let total = recommendations.map(recommendation => {
  return foods[153].nutrients[recommendation.id];
});

let foodOptions = Object.keys(foods)
    .map(foodId => ({id: foodId, label: foods[foodId].name}));

class App extends Component {
  constructor(props) {
    super();
    let selectedFoods = [
      {
        id: 4401,
        amount: 23,
      },
      {
        id: 7871,
        amount: 96,
      },
      {
        id: 346,
        amount: 100,
      },
      {
        id: 352,
        amount: 100,
      },
      {
        id: 30394,
        amount: 65,
      },
      {
        id: 423,
        amount: 190,
      },
      {
        id: 4404,
        amount: 165,
      },
      // {
      //   id: 153,
      //   amount: 30,
      // },
    ];
    this.state = {
      selectedFoods: selectedFoods,
      total: this.calculateTotal(selectedFoods),
    };
  }

  calculateTotal(selectedFoods) {
    return recommendations.map(recommendation => {
      return selectedFoods.reduce(
          (value, food) => value + food.amount / 100 * foods[food.id].nutrients[recommendation.id],
          0
      );
    })
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
  }

  render() {
    console.log(this.state.selectedFoods);

    return (
        <div className="grid">
          <div className="input-container">
            <Typeahead
                options={foodOptions}
                onChange={(selected) => this.selectFood(
                    parseInt(selected.pop().id), 30)}
            />
            {this.state.selectedFoods.map(selectedFood =>
                <div key={selectedFood.id}>
                  {foods[selectedFood.id].name}
                </div>
            )}
          </div>
          <div>
            <table className="table">
              <thead>
              <tr>
                <th>Name</th>
                <th>Total</th>
                <th>Recommendation</th>
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
                    </td>
                    <td>
                      {recommendation.male} {recommendation.unit}
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
