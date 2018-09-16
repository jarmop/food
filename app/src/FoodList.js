import React from 'react';
import './FoodList.css';

const FoodList = ({foods, selectedFoods, onDelete, onSelect}) => {
  return (
      <div className="food-list">
        {selectedFoods.map((food) =>
            <div
                className="food"
                key={food.id}
                onMouseEnter={() => onSelect(food.id)}
                onMouseLeave={() => onSelect(null)}
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