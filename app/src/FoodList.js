import React from 'react';
import './FoodList.css';

const FoodList = ({selectedFoods, foods, onDelete}) => {
  return (
      <div className="food-list">
        {selectedFoods.map((food) =>
            <div className="food" key={food.id}>
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