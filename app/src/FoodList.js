import React from 'react';

const FoodList = ({selectedFoods, foods}) => {
  return (
      <div className="food-list">
        {selectedFoods.map((selectedFood, index) =>
            <div key={index}>
              {foods[selectedFood.id].name}, {selectedFood.amount} g
            </div>
        )}
      </div>
  );
};

export default FoodList;