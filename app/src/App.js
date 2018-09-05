import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import recommendations from './data/recommendations';
import food from './data/food';

let total = recommendations.map(recommendation => food[153].nutrients[recommendation.id]);

let foods = {
  153: "kaurahiutale",
};

let foodOptions = Object.keys(foods).map(foodId => ({id: foodId, label: foods[foodId]}));

class App extends Component {
  constructor(props) {
    super();
   this.state = {
     selectedFoods: [153],
   };
  }

  selectFood(newFoodId) {
    let selectedFoods = this.state.selectedFoods.slice();
    if (selectedFoods.includes(newFoodId)) {
      return;
    }

    selectedFoods.push(newFoodId);

    this.setState({
      selectedFoods: selectedFoods
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
                {/*{this.state.selectedFoods.map(foodId =>*/}
                    {/*<th key={foodId} className="food-column">{foods[foodId]}</th>*/}
                {/*)}*/}
                <th>Total</th>
                <th>Recommendation</th>
              </tr>
              </thead>
              <tbody>
              {recommendations.map((recommendation, index) =>
                  <tr key={index}>
                    <td>{recommendation.name}</td>
                    {this.state.selectedFoods.map(foodId =>
                        <td key={foodId}>
                          {/*{Math.min(Math.round(total[index] / recommendation.male * 100), 100)}*/}
                          <div className="bar">
                            <div
                                className="bar__fill"
                                style={{width: Math.min(total[index] / recommendation.male * 100, 100) + '%'}}
                            ></div>
                          </div>
                        </td>
                    )}
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
