import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import recommendations from './data/recommendations';
import food from './data/food';

let total = recommendations.map(recommendation => {
  return food[153].nutrients[recommendation.id];
});

let foodOptions = Object.keys(food).map(foodId => ({id: foodId, label: food[foodId].name}));

class App extends Component {
  constructor(props) {
    super();
   this.state = {
     selectedFoods: [153],
     total: total,
   };
  }

  selectFood(newFoodId) {
    let selectedFoods = this.state.selectedFoods.slice();
    if (selectedFoods.includes(newFoodId)) {
      return;
    }

    selectedFoods.push(newFoodId);

    this.setState({
      selectedFoods: selectedFoods,
      total: recommendations.map(recommendation => {
        return selectedFoods.reduce((value, foodId) => value + food[foodId].nutrients[recommendation.id], 0);
      })
    });
  }

  render() {
    return (
        <div className="grid">
          <div className="input-container">
            <Typeahead
                options={foodOptions}
                onChange={(selected) => this.selectFood(parseInt(selected.pop().id))}
            />
            {this.state.selectedFoods.map(foodId =>
                <div key={foodId}>
                  {food[foodId].name}
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
                              style={{width: Math.min(this.state.total[index] / recommendation.male * 100, 100) + '%'}}
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
