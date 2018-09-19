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
  // return total.toFixed(total <= 10 ? 2 : (total < 100 ? 1 : 0));
  // return total.toFixed(recommendation < 2 ? 2 : (recommendation < 10 ? 1 : 0));
  return total.toFixed(recommendation < 2 ? 1 : 0);
};

const NutrientTable = ({foods, mealFoods, selectedFoods}) => {
  let selectedFoodPart = selectedFoods.length > 0 ? calculateTotal(recommendations, foods, mealFoods.filter(food => selectedFoods.includes(food.id))) : null;
  let nonSelectedFoodPart = calculateTotal(recommendations, foods, mealFoods.filter(food => !selectedFoods.includes(food.id)));
  let total = calculateTotal(recommendations, foods, mealFoods);

  return (
      <table className="nutrient-table">
        <thead>
        <tr>
          <th className="nutrient-table__column">Nimi</th>
          <th className="nutrient-table__column" colSpan="3">Saanti / suositus</th>
          {/*<th>Suositus</th>*/}
          <th className="nutrient-table__column">Yläraja</th>
          <th className="nutrient-table__column">Yksikkö</th>
        </tr>
        </thead>
        <tbody>
        {recommendations.map((recommendation, index) =>
            <tr key={index}>
              <td className="nutrient-table__column">{recommendation.name}</td>
              <td className="nutrient-table__column">
                <div>
                  <FoodBar max={recommendation.male} part1={selectedFoodPart ? nonSelectedFoodPart[index] : total[index]} part2={selectedFoodPart ? selectedFoodPart[index]: 0}/>
                </div>
              </td>
              <td className="nutrient-table__column nutrient-table__column--no-padding">
                {formatTotal(
                    total[index] -
                    (selectedFoodPart ? selectedFoodPart[index] : 0),
                    recommendation.male
                )}
              </td>
              <td className="nutrient-table__column">
                &nbsp;/&nbsp;{recommendation.male}
              </td>
              <td className="nutrient-table__column">
                {recommendation.max}
              </td>
              <td className="nutrient-table__column">
                {recommendation.unit}
              </td>
            </tr>
        )}
        </tbody>
      </table>
  );
};

export default NutrientTable;