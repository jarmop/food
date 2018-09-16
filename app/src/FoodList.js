import React from 'react';
import './FoodList.css';

const FoodList = ({foods, mealFoods, selectedFoods, onDelete, onSelect}) => {
  return (
      <div className="food-list">
        {mealFoods.map((food) =>
            <div
                className={'food' + (selectedFoods.includes(food.id) ? ' food--selected' : '')}
                key={food.id}
                onClick={() => onSelect(food.id)}
            >
              {foods[food.id].name}, {food.amount} g
              <span
                  className="food__delete"
                  onClick={() => onDelete(food.id)}
              >
                X
              </span>
            </div>
        )}
      </div>
  );
};

export default FoodList;