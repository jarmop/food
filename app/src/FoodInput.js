import {Typeahead} from 'react-bootstrap-typeahead';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './FoodInput.css';

class FoodInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      foodId: null,
      amount: 100,
    };

    this.submit = this.submit.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  setFood(foodId) {
    this.setState({
      foodId: foodId,
    });
  }

  setAmount(amount) {
    this.setState({
      amount: amount,
    });
  }

  isValid() {
    return this.state.foodId && this.state.amount;
  }

  submit() {
    this.props.onAdd(this.state.foodId, this.state.amount);
  }

  render() {
    let {foodOptions, onAdd} = this.props;

    return (
        <div className="input-container">
          <Typeahead
              options={foodOptions}
              onChange={selected => this.setFood(parseInt(selected.pop().id))}
              placeholder="Select food"
          />
          <div>
            <input
                className="input-amount form-control"
                type="number"
                value={this.state.amount}
                onChange={event => this.setAmount(parseInt(event.target.value))}
            /> g
          </div>
          <input
              className="btn btn-primary"
              type="button"
              value="Add"
              onClick={this.submit}
              disabled={!(this.state.foodId && this.state.amount)}
          />
        </div>

    );
  }
}

export default FoodInput;