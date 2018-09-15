import recommendations from './data/recommendations';
import React from 'react';

const calculateTotal = (recommendations, foods, selectedFoods) => {
  return recommendations.map(recommendation => {
    return selectedFoods.reduce(
        (value, food) => {
          // console.log(food);
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

const NutrientTable = ({foods, selectedFoods}) => {

  let total = calculateTotal(recommendations, foods, selectedFoods);

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
                <div className="bar">
                  <div
                      className="bar__fill"
                      style={{
                        width: Math.min(total[index] /
                            recommendation.male * 100, 100) + '%'
                      }}
                  ></div>
                </div>
                <div className="total-amount">
                  {formatTotal(total[index], recommendation.male)}
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