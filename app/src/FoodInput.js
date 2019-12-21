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

  submit() {
    this.props.onAdd(this.state.foodId, this.state.amount);
    this.typeahead.getInstance().clear();
  }

  render() {
    const {foodOptions} = this.props;

    return (
        <div className="input-container">
          <Typeahead
              options={foodOptions}
              onChange={selected => this.setFood(parseInt(selected.pop().id))}
              placeholder="Valitse ruoka"
              ref={(typeahead) => this.typeahead = typeahead}
          />
          <div>
            <input
                className="input-amount form-control"
                type="number"
                defaultValue={100}
                onChange={event => this.setAmount(parseInt(event.target.value))}
            /> g
          </div>
          <input
              className="btn btn-primary"
              type="button"
              value="Lisää"
              onClick={this.submit}
              disabled={!(this.state.foodId && this.state.amount)}
          />
        </div>

    );
  }
}

export default FoodInput;