import React from 'react';
import './FoodList.css';

const FoodList = ({foods, mealFoods, selectedFoods, onDelete, onSelect, onToggleAll}) => {
  return (
      <div className="food-list">
        {mealFoods.map((food) =>
            <div
                className={'food' + (selectedFoods.includes(food.id) ? ' food--selected' : '')}
                key={food.id}
                onClick={() => onSelect(food.id)}
            >
              {foods[food.id].name}, {food.amount} g
            </div>
        )}
        <div className="food-list-actions">
          <button
              className="btn btn-primary"
              onClick={onToggleAll}
          >
            {mealFoods.length === selectedFoods.length ? 'Poista valinnat' : 'Valitse kaikki'}
          </button>
          {selectedFoods.length > 0 &&
          <button
              className="btn btn-danger"
              onClick={() => onDelete(selectedFoods)}
          >
            Poista valitut
          </button>
          }
        </div>
      </div>
  );
};

export default FoodList;