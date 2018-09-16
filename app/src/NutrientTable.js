import React from 'react';
import recommendations from './data/recommendations';
import './NutrientTable.css';
import FoodBar from './FoodBar';

const calculateTotal = (recommendations, foods, selectedFoods) => {
  return recommendations.map(recommendation => {
    return selectedFoods.reduce(
        (value, food) => {
          return value + food.amount / 100 *
              foods[food.id].nutrients[recommendation.id];
        },
        0
    );
  });
};

const formatTotal = (total, recommendation) => {
  return total.toFixed(recommendation <= 20 && total < recommendation ? 1 : 0);
};

const NutrientTable = ({foods, mealFoods, selectedFoods}) => {
  let selectedFoodPart = selectedFoods.length > 0 ? calculateTotal(recommendations, foods, mealFoods.filter(food => selectedFoods.includes(food.id))) : null;
  let nonSelectedFoodPart = calculateTotal(recommendations, foods, mealFoods.filter(food => !selectedFoods.includes(food.id)));
  let total = calculateTotal(recommendations, foods, mealFoods);

  return (
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Total</th>
          <th>Recommendation</th>
          <th>Max</th>
          <th>Unit</th>
        </tr>
        </thead>
        <tbody>
        {recommendations.map((recommendation, index) =>
            <tr key={index}>
              <td>{recommendation.name}</td>
              <td>
                <div className="amount">
                  <FoodBar max={recommendation.male} part1={selectedFoodPart ? nonSelectedFoodPart[index] : total[index]} part2={selectedFoodPart ? selectedFoodPart[index]: 0}/>
                  <span className="total-amount">
                    {formatTotal(total[index], recommendation.male)}
                  </span>
                </div>
              </td>
              <td>
                {recommendation.male}
              </td>
              <td>
                {recommendation.max}
              </td>
              <td>
                {recommendation.unit}
              </td>
            </tr>
        )}
        </tbody>
      </table>
  );
};

export default NutrientTable;